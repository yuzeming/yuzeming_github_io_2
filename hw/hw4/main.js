function format(template, json) {
    return template.replace(/#\{([^\}]*)\}/g, function(all, key) {
      return json[key];
    });
}

function loadimg(){
	var item_width = $("div.slider").width();
	var item_height = $("div.slider").height();
	var item_length;
	var autopaly = null;
	$.getJSON("piclist.json",function(res){
		item_length = res.length;
		for (x in res){
			$("div.slider").append(format('<div class="slider-box"><img src="#{src}"><div>#{title}</div></div>',res[x]));
		}
		$("div.slider-box").width(item_width).height(item_height);
		setCurrent(current);
		$("div.slider-box").css("display","block");
	})

	var current = localStorage.getItem("pg");
	if (current == null){
		current = 0;
	}

	function setCurrent(value) {
		localStorage["pg"] = value;
		var boxes = $("div.slider-box");
		for (var x=0;x<boxes.length;++x) {
			boxes[x].style['-webkit-transform']="translateX("+(x-value)*(item_width+10)+"px)";
		}
	}

	$("div.left").bind("click",function(){
		if (current>0){
			current--;
			setCurrent(current);
		}
	})
	$("div.right").bind("click",function(){
		if (current<item_length-1){
			current++;
			setCurrent(current);
		}
	})

	$("div.play").bind("click",function(){
		if (autopaly == null) { 
			autopaly = setInterval(function(){
				current = (current+1) % item_length;
				setCurrent(current);
			},3000);
		} else {
			clearInterval(autopaly);
		}
	})
}

function loadcomments(){
	var currentpage = 0;
	var totpage = 0;

	function showcommit(pg){
		if (typeof pg =="object"){
			pg = pg.data.pg;
		}
		currentpage = pg;
		$.getJSON("comments-"+pg+".json",function(json){
			$("div.tie").remove();
			for (x in json){
				$("div.comments").append('<div class="tie"><div class="author">'+json[x][0]+'</div><div class="body">'+json[x][1]+'</div></div>');
			}
		$("div.pg div").removeClass("pgnow");
		$("div.pg div")[pg-1].classList.add("pgnow");
		})
	}

	function showpages(tp){
		for (var x = 1;x <=tp ;++x){
			$("div.pg").append($("<div>"+x+"</div>").bind("click",{"pg":x},showcommit));
		}
	}

	function pgup() {
		if (currentpage > 1) {
			--currentpage;
		}
		showcommit(currentpage);
	}


	function pgdw() {
		if (currentpage < totpage) {
			++currentpage;
		}
		showcommit(currentpage);
	}

	$.getJSON("comments.json",function(res){
		totpage = res.totpage;
		showpages(totpage);
		showcommit(1);
	})

	$("div.pgup").bind("click",pgup);
	$("div.pgdw").bind("click",pgdw);

}


$("body").ready( function (){
	loadimg();
	loadcomments();
});



