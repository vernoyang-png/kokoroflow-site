/* KokoroFlow · Computer Help — shared questionnaire logic.
   Each page defines window.KF_GUIDE = { steps:[], tips:[], conflict(symptom, scope) } */
(function () {
  var G = window.KF_GUIDE;
  var form = document.getElementById('questionnaire');
  if (!G || !form) return;
  var $ = function (id) { return document.getElementById(id); };
  var symptom = $('symptom'), scope = $('scope'), change = $('change');
  var summary = $('summary'), copyStatus = $('copyStatus'), result = $('result');

  var scopeText = [
    'If possible, compare with a device where the same setup still works.',
    'Record whether all affected devices started having trouble at the same time.',
    'Compare another device if you have one available.'
  ];

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var advice = G.steps[Number(symptom.value)];
    var tip = G.tips[Number(change.value)];
    var conflict = G.conflict ? G.conflict(Number(symptom.value), Number(scope.value)) : '';

    $('step').textContent = advice;
    $('context').textContent = scopeText[Number(scope.value)];
    $('tipText').textContent = tip;
    $('tipBox').hidden = !tip;
    $('conflictText').textContent = conflict;
    $('conflictBox').hidden = !conflict;

    summary.value = [
      'Symptom: ' + symptom.selectedOptions[0].text,
      'Scope: ' + scope.selectedOptions[0].text,
      'Recent change: ' + change.selectedOptions[0].text,
      'Suggested check: ' + advice,
      tip ? 'Also consider: ' + tip : ''
    ].filter(Boolean).join('\n');

    copyStatus.textContent = '';
    result.hidden = false;
    $('resultTitle').focus();
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('copy').addEventListener('click', function () {
    function fallback() {
      summary.focus(); summary.select();
      copyStatus.textContent = 'Summary selected. Use Ctrl+C or Command+C to copy.';
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) { fallback(); return; }
    navigator.clipboard.writeText(summary.value).then(function () {
      copyStatus.textContent = 'Summary copied.';
    }, fallback);
  });

  $('reset').addEventListener('click', function () {
    form.reset();
    result.hidden = true;
    copyStatus.textContent = '';
    symptom.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
