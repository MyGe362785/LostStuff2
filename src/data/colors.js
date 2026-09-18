// Standard 12 color variants for university lost and found portal
// 🔴 แดง, 🟠 ส้ม, 🟡 เหลือง, 🟢 เขียว, 🔵 ฟ้า, 🔵 น้ำเงิน, 🟣 ม่วง, 🩷 ชมพู, 🟤 น้ำตาล, ⚫ ดำ, ⚪ ขาว, 🩶 เทา

export const colorOptions = [
  { id: 'red', hex: '#EF4444', emoji: '🔴', nameTh: 'สีแดง', nameEn: 'Red' },
  { id: 'orange', hex: '#F97316', emoji: '🟠', nameTh: 'สีส้ม', nameEn: 'Orange' },
  { id: 'yellow', hex: '#EAB308', emoji: '🟡', nameTh: 'สีเหลือง', nameEn: 'Yellow' },
  { id: 'green', hex: '#22C55E', emoji: '🟢', nameTh: 'สีเขียว', nameEn: 'Green' },
  { id: 'lightblue', hex: '#38BDF8', emoji: '🔵', nameTh: 'สีฟ้า', nameEn: 'Light Blue' },
  { id: 'navy', hex: '#1D4ED8', emoji: '🔵', nameTh: 'สีน้ำเงิน', nameEn: 'Dark Blue' },
  { id: 'purple', hex: '#A855F7', emoji: '🟣', nameTh: 'สีม่วง', nameEn: 'Purple' },
  { id: 'pink', hex: '#EC4899', emoji: '🩷', nameTh: 'สีชมพู', nameEn: 'Pink' },
  { id: 'brown', hex: '#78350F', emoji: '🟤', nameTh: 'สีน้ำตาล', nameEn: 'Brown' },
  { id: 'black', hex: '#18181B', emoji: '⚫', nameTh: 'สีดำ', nameEn: 'Black' },
  { id: 'white', hex: '#FFFFFF', emoji: '⚪', nameTh: 'สีขาว', nameEn: 'White' },
  { id: 'gray', hex: '#6B7280', emoji: '🩶', nameTh: 'สีเทา', nameEn: 'Gray' }
]

export function getColorHex(colorKey) {
  if (!colorKey) return '#784D34'
  const key = String(colorKey).toLowerCase().trim()
  const found = colorOptions.find(c => c.id === key)
  if (found) return found.hex
  
  // Intelligent fallbacks for any legacy or custom keywords
  if (key.includes('red') || key.includes('แดง')) return '#EF4444'
  if (key.includes('orange') || key.includes('ส้ม')) return '#F97316'
  if (key.includes('yellow') || key.includes('เหลือง')) return '#EAB308'
  if (key.includes('green') || key.includes('เขียว')) return '#22C55E'
  if (key.includes('ฟ้า') || key.includes('lightblue') || key.includes('sky')) return '#38BDF8'
  if (key.includes('navy') || key.includes('น้ำเงิน') || key.includes('กรม') || key.includes('blue')) return '#1D4ED8'
  if (key.includes('purple') || key.includes('ม่วง')) return '#A855F7'
  if (key.includes('pink') || key.includes('ชมพู')) return '#EC4899'
  if (key.includes('brown') || key.includes('น้ำตาล')) return '#78350F'
  if (key.includes('black') || key.includes('ดำ')) return '#18181B'
  if (key.includes('white') || key.includes('ขาว')) return '#FFFFFF'
  if (key.includes('gray') || key.includes('grey') || key.includes('เทา') || key.includes('silver') || key.includes('เงิน')) return '#6B7280'
  
  return '#784D34'
}
