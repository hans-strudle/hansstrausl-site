(function init(){
  var snippets = document.getElementsByTagName('pre');
  Array.from(snippets).forEach(function(snippet){
    snippet.innerHTML = buildCodeHTML(snippet.innerHTML);
  });
});

function buildCodeHTML(code){
  var HTML = '';
  HTML = code
         .replace(/\"(.+)\"/g, function(match,inner){
		return '<code style="color:green">"' + inner + '"</code>'
	 })
         .replace(/\{/g, '<code style="color:purple">{</code>')
         .replace(/\}/g, '<code style="color:purple">}</code>');
  return HTML;
}
