function hhmmss(s) {
  const digit = (n)=>String(Math.floor(n)).padStart(2,'0');

  if (Number.isNaN(Number.parseInt(s)) || s < 0) {
    return '-';
  } if (s >= 60*60) {
    return `${Math.floor(s/60/60)}:${digit((s/60)%60)}:${digit(s%60)}`;
  } else {
    return `${digit((s/60)%60)}:${digit(s%60)}`;
  }
}

export {hhmmss};
