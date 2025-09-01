export function nowHHmm(): string {
const d = new Date();
const hh = String(d.getHours()).padStart(2, '0');
const mm = String(d.getMinutes()).padStart(2, '0');
return `${hh}:${mm}`;
}


export function isEndAfterStart(start: string, end: string): boolean {
const [sh, sm] = start.split(':').map(Number);
const [eh, em] = end.split(':').map(Number);
return eh * 60 + em > sh * 60 + sm;
}