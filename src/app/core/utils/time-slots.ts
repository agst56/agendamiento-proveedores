export const TIME_SLOTS: string[] = (() => {
const slots: string[] = [];
let h = 7, m = 0; // desde 07:00
while (h < 18 || (h === 18 && m === 0)) {
const hh = String(h).padStart(2, '0');
const mm = String(m).padStart(2, '0');
slots.push(`${hh}:${mm}`);
m += 30;
if (m === 60) { m = 0; h += 1; }
}
return slots; // 07:00 ... 18:00 cada 30min
})();