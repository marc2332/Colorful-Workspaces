
if(!semver.gt(GravitonInfo.version,"1.1.0")) {
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
			console.log(dir.color)
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
		console.log(list)
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
         <p>${one.path.replace(/\\/g, "\\\\")}</p>
         <div style="background:rgb(${one.color.r},${one.color.g},${one.color.b}); width:15px; height:15px;border-radius:50px;"></div>
      </div>
      <span class="line_space_menus"></span>
     `
  })
  Settings.addNewSection({
    name:"Color Workspaces",
    content:`
    <h3>Saved workspaces:</h3>
    ${content}
    `
  })
})
