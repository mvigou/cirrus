function chess (obj) { // = Create HTML Elements Short Syntax.

	let elm = document.createElement(obj.type); // REQUIRED. Define <tag> type.

	// OPTIONAL : define textual or HTML content. Only one is permitted.	
	if(obj.text) {
		elm.textContent = obj.text;
	}
	else if(obj.html) {
		elm.innerHTML = obj.html;
	}

	if(obj.attributes) { // OPTIONAL : define attributes (id, class, title, basic events...).
		for(let attribute in obj.attributes) {
			elm.setAttribute(attribute, obj.attributes[attribute]);
		}
	}
	
	if(obj.events) { // OPTIONAL : define advanced events.
		for(let event of obj.events) {
			elm.addEventListener(event.type, event.function);
		}
	}

	if(obj.children) { // OPTIONAL : append children.	
		for(let child of obj.children) {
			elm.appendChild(chess(child));
		}
	}

	return elm;

}