import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('theme contract', () => {
  it('uses warm light mode and dark mode instead of the former red theme', () => {
    const app = readFileSync('src/App.vue', 'utf8')
    const navbar = readFileSync('src/components/Navbar.vue', 'utf8')
    const styles = readFileSync('src/style.css', 'utf8')

    expect(styles).toContain(":root[data-theme='dark']")
    expect(styles).toContain('color-scheme: dark')
    expect(styles).not.toContain("data-theme='mono-red'")
    expect(app).toContain("theme === 'dark'")
    expect(navbar).toContain("theme === 'dark'")
    expect(navbar).toContain('เปลี่ยนเป็นโหมดมืด')
    expect(navbar).not.toContain('ธีมดำ ขาว แดง')
  })

  it('migrates previously saved alternate themes to dark mode', () => {
    const entry = readFileSync('index.html', 'utf8')
    expect(entry).toContain("['dark', 'mono-red', 'vivid'].includes(savedTheme) ? 'dark' : 'warm'")
  })
})
