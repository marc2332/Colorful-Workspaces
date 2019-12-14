
if(GravitonInfo < "191208") {
  graviton.consoleWarn("Colorful Workspaces does not work on your Graviton.")
  return
};

const plugin = new Plugin({
	name: "Colorful-Workspaces"
})

plugin.createData({
	list: []
})

const loadFromList = (list,path) => {
	list.forEach(dir => {
		if (path == dir.path) {
			document.body.style = `box-sizing:border-box;border:solid 3px rgb(${dir.color.r},${dir.color.g},${dir.color.b})`
		}
	})
}

document.addEventListener("new_recent_project", e => {
	const project = e.detail
	plugin.getData(function(data) {
		const list = data.list
		list.push({
			path: project.path,
			color: tinycolor.random().toRgb()
		})
		plugin.saveData({
			list: list
		})
    loadFromList(list,project.path)
	})
})
document.addEventListener("loaded_project", e => {
	plugin.getData(function(data) {
		loadFromList(data.list,e.detail.path)
	})
})

plugin.getData((data)=>{
  let content ="";
  data.list.forEach((one)=>{
     content += `
     <div class="section-1">
         <p style=" margin:5px 0px;">${one.path.replace(/\\/g, "\\")}</p>
         <div style="display:inline-block; background:rgb(${one.color.r},${one.color.g},${one.color.b}); width:15px; height:15px;border-radius:50px; margin-right:8px;"></div>
         <input style="margin:5px 0px;  display:inline-block;" class="input4" value="${one.color.r},${one.color.g},${one.color.b}"></input>
      </div>
      <span class="line_space_menus"></span>
     `
  })
	const workspaces_dm = new dropMenu({
		id:"my_dropmenu"
	});
	workspaces_dm.setList({
		"button": "Workspaces",
		"list":{
			 "Configuration":{
					click:function(){
						const ws_window = new Window({
							content:`
								<div class="section-4" id="colorfulworkspaces">
									<h3>Saved workspaces:</h3>
									${content}
								</div>
							`
						})
						ws_window.launch()
						const page = document.getElementById("colorfulworkspaces");
						for(i=0;i<page.children.length;i++){
							if( page.children[i].classList == "section-1"){
								const section = page.children[i]
								const input = page.children[i].children[2];
								input.oninput = (button) =>{
									section.children[1].style.background = input.value
									plugin.getData(function(data) {
										const list = data.list
										const project = list.filter((item)=>{
											return item.path == section.children[0].textContent
										})[0]
										project.color = tinycolor(input.value).toRgb();
										loadFromList(list,project.path)
									})
								}
								input.onchange = ()=> {
									plugin.getData(function(data) {
										const list = data.list
										const project = list.filter((item)=>{
											return item.path == section.children[0].textContent
										})[0]
										project.color = tinycolor(input.value).toRgb();
										plugin.saveData({
											list: list
										})
										loadFromList(list,project.path)
									})
								}
							}
						}	
					}
				}
		}
	})

})
