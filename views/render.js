function render(newDom) {
  const rootDiv = document.getElementById('root');
  while (rootDiv.firstChild) {
    rootDiv.removeChild(rootDiv.firstChild);
  };

  rootDiv.appendChild(newDom);
}
