function showmenu(){
    document.getElementById("frame").classList.toggle("adjustframe");
    document.getElementById("menu_line1").classList.toggle("l1");
    document.getElementById("menu_line3").classList.toggle("l3");
    document.getElementById("menu_line2").classList.toggle("l2");
}
function expand_menu(selector){
    document.getElementById("menu").classList.toggle(selector + "_show");
}

function angrymode(){
    document.body.classList.toggle("angrymode");
    document.getElementById("chat_box").classList.toggle("angrymode");
    document.getElementById("msg_input_frame").classList.toggle("angrymode");
    document.getElementById("lines").classList.toggle("angrymode");
    document.getElementById("frame").classList.toggle("angryshake");
}

function check_usrname(){
    const name_field = document.getElementById("user_name");
    const name = String(document.getElementById("user_name").value);
    if(name_field.classList.contains("shake-horizontal")){
        name_field.classList.remove("shake-horizontal");
        console.log("removed class");
    }
    if(name.includes(" ") || name == ""){
        name_field.classList.add("shake-horizontal");
        return false;
    }else{
        return true;
    }
}
function overlay(type) {
    const background = document.getElementById("pubg");
    background.style.display = "flex";
    const modal_headline = document.getElementById("modal_headline");
    const color_theme_input = document.getElementById("color_theme_input");

    const start_button = document.getElementById("start_button");
    const name_field = document.getElementById("user_name");


    if(type === "login"){
        modal_headline.innerHTML = "Welcome to MC-Messenger"
    }else if(type === "settings"){
        modal_headline.innerHTML = "Settings"
        color_theme_input.style.display = "flex";
    }


    start_button.onclick = function (){
        if(check_usrname()){
            background.style.display = "none";
            userdb.me.na = name_field.value;
            MessageHandle.sendMetaChange();
        }
    }
    window.onclick = function(event) {
        if (event.target == background && check_usrname()) {
            background.style.display = "none";
            userdb.me.na = name_field.value;
            MessageHandle.sendMetaChange();
        }
    }
}

function viewport_check() {
    console.log("Viewport_check")
    let mobile_viewport = window.matchMedia("(max-width: 500px)");
    let pc_viewport = window.matchMedia("(min-width: 501px");
    function mobile_viewport_change(){
        if (mobile_viewport.matches) {
            console.log("mobile");
            var fragment = document.createDocumentFragment();
            fragment.appendChild(document.getElementById("userlist"));
            document.getElementById("menu_files_content").appendChild(fragment);
        }
    }
    mobile_viewport.addListener(mobile_viewport_change);

    function pc_viewport_change(){
        if (pc_viewport.matches) {
            console.log("pc");
            var fragment = document.createDocumentFragment();
            fragment.appendChild(document.getElementById("userlist"));
            document.getElementById("userlist_parent").appendChild(fragment);
            document.getElementById("menu").classList.remove("menu_files_show");
        }
    }
    pc_viewport.addListener(pc_viewport_change);

    mobile_viewport_change();
    pc_viewport_change();
}

function change_color_theme(theme){
    const color_link = document.getElementById("color_theme_link");
    let color_theme = document.getElementById("color_theme_selector");
    switch (theme){
        case "dark":
            color_link.setAttribute("href", "css/color_themes/dark_theme.css")
            break;
        case "light":
            color_link.setAttribute("href", "css/color_themes/light_theme.css")
            break;
        case "dhbw":
            color_link.setAttribute("href", "css/color_themes/dhbw_theme.css")
            break;
        default:
            console.log(color_theme.value)
            change_color_theme(color_theme.value)
            break;
    }
}
