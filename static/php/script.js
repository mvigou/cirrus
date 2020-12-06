
// Variables
let currentDir = '/datas/'; // By default, start at the root of datas folder.

// Functions
function displayCurrentDir(dir) {

	let req = new XMLHttpRequest();
	req.open('GET', '/scripts/readCurrentDir.php?currentDir=' + currentDir, true);
	req.onload = () => {
		buildCurrentDir(JSON.parse(req.responseText));
	};
	req.send(null);

}

function buildCurrentDir(dirTree) {

	let explorerElm = document.getElementById('explorer');
	explorerElm.innerHTML = '';

	for(let elm of dirTree) {	

		explorerElm.appendChild(buildElm(elm));


	}
	
}

function buildElm(elm) {

	let treeElm = document.createElement('a');
	treeElm.href = "#";
	treeElm.textContent = elm.name;
	


	treeElm.onclick = (elm) => {
		
		console.log(function() {


			(elm) => {
			
				return 'elm';
	
			}




		});
		
	}


	return treeElm;
}



// Procedural
displayCurrentDir(currentDir);