/**
 * This is the main library for the application 
 */
function HDSLib() {

    var context = this;

    context.api = {
        invokeUrl: "https://tuv8lr36xk.execute-api.us-east-1.amazonaws.com/Prod/" // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
    };
    context.cognito = {
        poolData : {
            UserPoolId: 'us-east-1_IzhdWRQAR', // e.g. us-east-1_MmGQqQzeu
            ClientId: '5ssha3j1trqpob1hqljn9a0a17' // e.g. 7hg4do6ellhudvh5q25jji4err
        },
        region: 'us-east-1'
    };

    /**
     * The accessToken of the cognito object
     */
    Object.defineProperties(context.cognito, {
        "accessToken" : {
            "get": function() {
                return sessionStorage.getItem("hds_cognito_access_token");
            },
            "set": function(value) {
                if (typeof(value)=="string"){
                    sessionStorage.setItem("hds_cognito_access_token", value);
                }
                if (value == null){
                    sessionStorage.removeItem("hds_cognito_access_token");
                }
            }
        }
    });

    /**
     * The idToken of the cognito object
     */
    Object.defineProperties(context.cognito, {
        "idToken" : {
            "get": function() {
                return sessionStorage.getItem("hds_cognito_id_token")
            },
            "set": function(value) {
                if (typeof(value)=="string"){
                    sessionStorage.setItem("hds_cognito_id_token", value);
                }
                if (value == null){
                    sessionStorage.removeItem("hds_cognito_id_token");
                }
            }
        }
    });

    /**
     * Adds a script to the current HTML document
     * @param {string} url The URL of the script to add
     * @param {function} callback What to do after the script is added (optional)
     */
    context.addScript = function(url, callback) {
        var script  = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", url);
        var head = document.getElementsByTagName('head')[0];
        script.onload = script.onreadystatechange = function(){
            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
                if (typeof(callback) ==='function'){
                    callback();
                }
                script.onload = script.onreadystatechange = null;
            }
            return true;
        };
        head.appendChild(script);
        return false;
    };


    // from https://github.com/amazon-archives/amazon-cognito-identity-js/blob/master/dist/
    context.addScript("./vendor/aws/aws-cognito-sdk.min.js", function(){
        context.addScript("./vendor/aws/amazon-cognito-identity.min.js", function(){
            context.cognito.userPool = {};
            context.cognito.cognitoUser = null;

            if (typeof (AWSCognito) !== 'undefined' && typeof (AWSCognito.config) !== 'undefined') {
                AWSCognito.config.region = context.cognito.region;
                context.cognito.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(context.cognito.poolData);
                context.cognito.createCognitoUser = function(username){
                    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
                        Username: username,
                        Pool: context.cognito.userPool
                    });
                };
                context.cognito.doubleCheckTokens = function(){
                    if (typeof(context.cognito.userPool)!="object"){return;}
                    var cognitoUser = context.cognito.userPool.getCurrentUser();
                    if (cognitoUser != null) {
                        cognitoUser.getSession(function(err, session) {
                            if (err) {
                                alert(err);
                                return;
                            }
                            if (!session.isValid() && context.cognito.idToken != null){
                                context.user_logout();
                            }
                        });
                    }
                    else if (context.cognito.idToken != null){
                        context.user_logout();
                    }
                };
            }
            else {
                console.log("AWSCognito not found");
            }
        });
    });

    context.destroySession = function(){
        if (typeof(sessionStorage)!="undefined" && typeof(sessionStorage.clear)=="function") {
            sessionStorage.clear();
        }
        if (typeof(localStorage)!="undefined" && typeof(localStorage.clear)=="function") {
            localStorage.clear();
        }
    };

    context.getSideNav = function () {
        var ul = document.createElement("ul");
        ul.id = "accordionSidebar";
        ul.className = "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion";
        ul.style.backgroundImage = "url('img/header-logo2.png')";
        var sb = new StringBuilder();
        sb.appendLine("");
        sb.appendLine("      <!-- Sidebar - Brand -->");
        sb.appendLine("      <a class=\"sidebar-brand d-flex align-items-center justify-content-center\" href=\"index.html\">");
        sb.appendLine("        <div class=\"sidebar-brand-icon\" style=\"height: 32px; width: 32px; background-image: url('img/innovation_chain128w.png'); background-repeat: no-repeat; background-position: center; background-size: contain;\">");
        sb.appendLine("        </div>");
        sb.appendLine("        <div class=\"sidebar-brand-text mx-3\">Harvard DS</div>");
        sb.appendLine("      </a>");
        sb.appendLine("");
        sb.appendLine("      <!-- Divider -->");
        sb.appendLine("      <hr class=\"sidebar-divider my-0\">");
        sb.appendLine("");
        if (context.cognito.idToken != null) {
            sb.appendLine("      <!-- Nav Item - Dashboard -->");
            sb.appendLine("      <li class=\"nav-item\">");
            sb.appendLine("        <a class=\"nav-link\" href=\"index.html\">");
            sb.appendLine("          <i class=\"fas fa-fw fa-tachometer-alt\"></i>");
            sb.appendLine("          <span>Dashboard</span></a>");
            sb.appendLine("      </li>");
            sb.appendLine("      <!-- Divider -->");
            sb.appendLine("      <hr class=\"sidebar-divider\">");
            sb.appendLine("      <!-- Heading -->");
            sb.appendLine("      <div class=\"sidebar-heading\">");
            sb.appendLine("        Interface");
            sb.appendLine("      </div>");
            sb.appendLine("");
            sb.appendLine("      <!-- Nav Item - Pages Collapse Menu -->");
            sb.appendLine("      <li class=\"nav-item\">");
            sb.appendLine("        <a class=\"nav-link collapsed\" href=\"#\" data-toggle=\"collapse\" data-target=\"#collapseTwo\" aria-expanded=\"true\" aria-controls=\"collapseTwo\">");
            sb.appendLine("          <i class=\"fas fa-fw fa-cog\"></i>");
            sb.appendLine("          <span>Settings</span>");
            sb.appendLine("        </a>");
            sb.appendLine("        <div id=\"collapseTwo\" class=\"collapse\" aria-labelledby=\"headingTwo\" data-parent=\"#accordionSidebar\">");
            sb.appendLine("          <div class=\"bg-white py-2 collapse-inner rounded\">");
            sb.appendLine("            <h6 class=\"collapse-header\">Custom Components:</h6>");
            sb.appendLine("            <a class=\"collapse-item\" href=\"#search-settings\">Search</a>");
            sb.appendLine("            <a class=\"collapse-item\" href=\"#language-settings\">Language</a>");
            sb.appendLine("          </div>");
            sb.appendLine("        </div>");
            sb.appendLine("      </li>");
            sb.appendLine("");
            sb.appendLine("      <!-- Nav Item - Utilities Collapse Menu -->");
            sb.appendLine("      <li class=\"nav-item active\">");
            sb.appendLine("        <a class=\"nav-link collapsed\" href=\"#\" data-toggle=\"collapse\" data-target=\"#collapseUtilities\" aria-expanded=\"false\" aria-controls=\"collapseUtilities\">");
            sb.appendLine("          <i class=\"fas fa-fw fa-wrench\"></i>");
            sb.appendLine("          <span>Utilities</span>");
            sb.appendLine("        </a>");
            sb.appendLine("        <div id=\"collapseUtilities\" class=\"collapse\" aria-labelledby=\"headingUtilities\" data-parent=\"#accordionSidebar\" style=\"\">");
            sb.appendLine("          <div class=\"bg-white py-2 collapse-inner rounded\">");
            sb.appendLine("            <h6 class=\"collapse-header\">Custom Utilities:</h6>");
            sb.appendLine("            <a class=\"collapse-item\" href=\"#utilities-color\">Colors</a>");
            sb.appendLine("            <a class=\"collapse-item\" href=\"#utilities-border\">Borders</a>");
            sb.appendLine("            <a class=\"collapse-item active\" href=\"#utilities-animation\">Animations</a>");
            sb.appendLine("            <a class=\"collapse-item\" href=\"#utilities-other\">Other</a>");
            sb.appendLine("          </div>");
            sb.appendLine("        </div>");
            sb.appendLine("      </li>");
            sb.appendLine("");
            sb.appendLine("      <!-- Divider -->");
            sb.appendLine("      <hr class=\"sidebar-divider\">");
            sb.appendLine("");
        }
        sb.appendLine("      <!-- Heading -->");
        sb.appendLine("      <div class=\"sidebar-heading\">");
        sb.appendLine("        Navigation");
        sb.appendLine("      </div>");
        sb.appendLine("");
        sb.appendLine("      <!-- Nav Item - Pages Collapse Menu -->");
        sb.appendLine("      <li class=\"nav-item\">");
        sb.appendLine("        <a class=\"nav-link collapsed\" href=\"#\" data-toggle=\"collapse\" data-target=\"#collapsePages\" aria-expanded=\"true\" aria-controls=\"collapsePages\">");
        sb.appendLine("          <i class=\"fas fa-fw fa-folder\"></i>");
        sb.appendLine("          <span>Pages</span>");
        sb.appendLine("        </a>");
        sb.appendLine("        <div id=\"collapsePages\" class=\"collapse\" aria-labelledby=\"headingPages\" data-parent=\"#accordionSidebar\">");
        sb.appendLine("          <div class=\"bg-white py-2 collapse-inner rounded\">");
        sb.appendLine("            <h6 class=\"collapse-header\">Login Screens:</h6>");
        sb.appendLine("            <a class=\"collapse-item\" href=\"#login\">Login</a>");
        sb.appendLine("            <a class=\"collapse-item\" href=\"#register\">Register</a>");
        sb.appendLine("            <a class=\"collapse-item\" href=\"#forgot-password\">Forgot Password</a>");
        sb.appendLine("            <div class=\"collapse-divider\"></div>");
        sb.appendLine("            <h6 class=\"collapse-header\">Other Pages:</h6>");
        sb.appendLine("            <a class=\"collapse-item\" href=\"#404\">404 Page</a>");
        sb.appendLine("            <a class=\"collapse-item\" href=\"#blank\">Blank Page</a>");
        sb.appendLine("          </div>");
        sb.appendLine("        </div>");
        sb.appendLine("      </li>");
        sb.appendLine("");
        if (context.cognito.idToken != null) {
            sb.appendLine("      <!-- Nav Item - Charts -->");
            sb.appendLine("      <li class=\"nav-item\">");
            sb.appendLine("        <a class=\"nav-link\" href=\"#charts\">");
            sb.appendLine("          <i class=\"fas fa-fw fa-chart-area\"></i>");
            sb.appendLine("          <span>Charts</span></a>");
            sb.appendLine("      </li>");
            sb.appendLine("");
            sb.appendLine("      <!-- Nav Item - Tables -->");
            sb.appendLine("      <li class=\"nav-item\">");
            sb.appendLine("        <a class=\"nav-link\" href=\"#tables\">");
            sb.appendLine("          <i class=\"fas fa-fw fa-table\"></i>");
            sb.appendLine("          <span>Tables</span></a>");
            sb.appendLine("      </li>");
            sb.appendLine("");
        }
        sb.appendLine("      <!-- Divider -->");
        sb.appendLine("      <hr class=\"sidebar-divider d-none d-md-block\">");
        sb.appendLine("");
        sb.appendLine("      <!-- Sidebar Toggler (Sidebar) -->");
        sb.appendLine("      <div class=\"text-center d-none d-md-inline\">");
        sb.appendLine("        <button class=\"rounded-circle border-0\" id=\"sidebarToggle\"></button>");
        sb.appendLine("      </div>");
        ul.innerHTML = sb.toString();
        return ul;
    }

    context.getTopNav = function () {
        var nav = document.createElement("nav");
        nav.className = "navbar navbar-expand navbar-light bg-hds topbar mb-4 static-top shadow";
        var sb = new StringBuilder();
        sb.appendLine("	<!-- Sidebar Toggle (Topbar) -->");
        sb.appendLine("	<button id=\"sidebarToggleTop\" class=\"btn btn-link d-md-none rounded-circle mr-3\">");
        sb.appendLine("		<i class=\"fa fa-bars\"></i>");
        sb.appendLine("	</button>");
        sb.appendLine("	<!-- Topbar Search -->");
        sb.appendLine("	<form class=\"d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search\">");
        sb.appendLine("		<div class=\"input-group\">");
        sb.appendLine("			<input type=\"text\" class=\"form-control bg-light border-0 small\" placeholder=\"Search for...\" aria-label=\"Search\" aria-describedby=\"basic-addon2\">");
        sb.appendLine("			<div class=\"input-group-append\">");
        sb.appendLine("				<button class=\"btn btn-primary\" type=\"button\" style=\"margin-top: -2px;\">");
        sb.appendLine("					<i class=\"fas fa-search fa-sm\"></i>");
        sb.appendLine("				</button>");
        sb.appendLine("			</div>");
        sb.appendLine("		</div>");
        sb.appendLine("	</form>");
        sb.appendLine("	<!-- Topbar Navbar -->");
        sb.appendLine("	<ul class=\"navbar-nav ml-auto\">");
        sb.appendLine("		<!-- Nav Item - Search Dropdown (Visible Only XS) -->");
        sb.appendLine("		<li class=\"nav-item dropdown no-arrow d-sm-none\">");
        sb.appendLine("			<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"searchDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");
        sb.appendLine("				<i class=\"fas fa-search fa-fw\"></i>");
        sb.appendLine("			</a>");
        sb.appendLine("			<!-- Dropdown - Messages -->");
        sb.appendLine("			<div class=\"dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in\" aria-labelledby=\"searchDropdown\">");
        sb.appendLine("				<form class=\"form-inline mr-auto w-100 navbar-search\">");
        sb.appendLine("					<div class=\"input-group\">");
        sb.appendLine("						<input type=\"text\" class=\"form-control bg-light border-0 small\" placeholder=\"Search for...\" aria-label=\"Search\" aria-describedby=\"basic-addon2\">");
        sb.appendLine("						<div class=\"input-group-append\">");
        sb.appendLine("							<button class=\"btn btn-primary\" type=\"button\">");
        sb.appendLine("								<i class=\"fas fa-search fa-sm\"></i>");
        sb.appendLine("							</button>");
        sb.appendLine("						</div>");
        sb.appendLine("					</div>");
        sb.appendLine("				</form>");
        sb.appendLine("			</div>");
        sb.appendLine("		</li>");
        if (context.cognito.idToken != null) {
            sb.appendLine("		<!-- Nav Item - Alerts -->");
            sb.appendLine("		<li class=\"nav-item dropdown no-arrow mx-1\">");
            sb.appendLine("			<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"alertsDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");
            sb.appendLine("				<i class=\"fas fa-bell fa-fw\"></i>");
            sb.appendLine("				<!-- Counter - Alerts -->");
            sb.appendLine("				<span class=\"badge badge-danger badge-counter\">3+</span>");
            sb.appendLine("			</a>");
            sb.appendLine("			<!-- Dropdown - Alerts -->");
            sb.appendLine("			<div class=\"dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in\" aria-labelledby=\"alertsDropdown\">");
            sb.appendLine("				<h6 class=\"dropdown-header\">");
            sb.appendLine("					Alerts Center");
            sb.appendLine("				</h6>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"mr-3\">");
            sb.appendLine("						<div class=\"icon-circle bg-primary\">");
            sb.appendLine("							<i class=\"fas fa-file-alt text-white\"></i>");
            sb.appendLine("						</div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div>");
            sb.appendLine("						<div class=\"small text-gray-500\">December 12, 2019</div>");
            sb.appendLine("						<span class=\"font-weight-bold\">A new monthly report is ready to download!</span>");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"mr-3\">");
            sb.appendLine("						<div class=\"icon-circle bg-success\">");
            sb.appendLine("							<i class=\"fas fa-donate text-white\"></i>");
            sb.appendLine("						</div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div>");
            sb.appendLine("						<div class=\"small text-gray-500\">December 7, 2019</div>");
            sb.appendLine("						$290.29 has been deposited into your account!");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"mr-3\">");
            sb.appendLine("						<div class=\"icon-circle bg-warning\">");
            sb.appendLine("							<i class=\"fas fa-exclamation-triangle text-white\"></i>");
            sb.appendLine("						</div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div>");
            sb.appendLine("						<div class=\"small text-gray-500\">December 2, 2019</div>");
            sb.appendLine("						Spending Alert: We've noticed unusually high spending for your account.");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item text-center small text-gray-500\" href=\"#\">Show All Alerts</a>");
            sb.appendLine("			</div>");
            sb.appendLine("		</li>");
            sb.appendLine("		<!-- Nav Item - Messages -->");
            sb.appendLine("		<li class=\"nav-item dropdown no-arrow mx-1\">");
            sb.appendLine("			<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"messagesDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");
            sb.appendLine("				<i class=\"fas fa-envelope fa-fw\"></i>");
            sb.appendLine("				<!-- Counter - Messages -->");
            sb.appendLine("				<span class=\"badge badge-danger badge-counter\">7</span>");
            sb.appendLine("			</a>");
            sb.appendLine("			<!-- Dropdown - Messages -->");
            sb.appendLine("			<div class=\"dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in\" aria-labelledby=\"messagesDropdown\">");
            sb.appendLine("				<h6 class=\"dropdown-header\">");
            sb.appendLine("					Message Center");
            sb.appendLine("				</h6>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"dropdown-list-image mr-3\">");
            sb.appendLine("						<img class=\"rounded-circle\" src=\"https://source.unsplash.com/fn_BT9fwg_E/60x60\" alt=\"\">");
            sb.appendLine("						<div class=\"status-indicator bg-success\"></div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div class=\"font-weight-bold\">");
            sb.appendLine("						<div class=\"text-truncate\">Hi there! I am wondering if you can help me with a problem I've been having.</div>");
            sb.appendLine("						<div class=\"small text-gray-500\">Emily Fowler � 58m</div>");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"dropdown-list-image mr-3\">");
            sb.appendLine("						<img class=\"rounded-circle\" src=\"https://source.unsplash.com/AU4VPcFN4LE/60x60\" alt=\"\">");
            sb.appendLine("						<div class=\"status-indicator\"></div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div>");
            sb.appendLine("						<div class=\"text-truncate\">I have the photos that you ordered last month, how would you like them sent to you?</div>");
            sb.appendLine("						<div class=\"small text-gray-500\">Jae Chun � 1d</div>");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"dropdown-list-image mr-3\">");
            sb.appendLine("						<img class=\"rounded-circle\" src=\"https://source.unsplash.com/CS2uCrpNzJY/60x60\" alt=\"\">");
            sb.appendLine("						<div class=\"status-indicator bg-warning\"></div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div>");
            sb.appendLine("						<div class=\"text-truncate\">Last month's report looks great, I am very happy with the progress so far, keep up the good work!</div>");
            sb.appendLine("						<div class=\"small text-gray-500\">Morgan Alvarez � 2d</div>");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item d-flex align-items-center\" href=\"#\">");
            sb.appendLine("					<div class=\"dropdown-list-image mr-3\">");
            sb.appendLine("						<img class=\"rounded-circle\" src=\"https://source.unsplash.com/Mv9hjnEUHR4/60x60\" alt=\"\">");
            sb.appendLine("						<div class=\"status-indicator bg-success\"></div>");
            sb.appendLine("					</div>");
            sb.appendLine("					<div>");
            sb.appendLine("						<div class=\"text-truncate\">Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren't good...</div>");
            sb.appendLine("						<div class=\"small text-gray-500\">Chicken the Dog � 2w</div>");
            sb.appendLine("					</div>");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item text-center small text-gray-500\" href=\"#\">Read More Messages</a>");
            sb.appendLine("			</div>");
            sb.appendLine("		</li>");
            sb.appendLine("		<div class=\"topbar-divider d-none d-sm-block\"></div>");
            sb.appendLine("		<!-- Nav Item - User Information -->");
            sb.appendLine("		<li class=\"nav-item dropdown no-arrow\">");
            sb.appendLine("			<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"userDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");
            sb.appendLine("				<span class=\"mr-2 d-none d-lg-inline text-gray-600 small\">Valerie Luna</span>");
            sb.appendLine("				<img class=\"img-profile rounded-circle\" src=\"https://source.unsplash.com/QAB-WJcbgJk/60x60\">");
            sb.appendLine("			</a>");
            sb.appendLine("			<!-- Dropdown - User Information -->");
            sb.appendLine("			<div class=\"dropdown-menu dropdown-menu-right shadow animated--grow-in\" aria-labelledby=\"userDropdown\">");
            sb.appendLine("				<a class=\"dropdown-item\" href=\"#\">");
            sb.appendLine("					<i class=\"fas fa-user fa-sm fa-fw mr-2 text-gray-400\"></i>");
            sb.appendLine("					Profile");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item\" href=\"#\">");
            sb.appendLine("					<i class=\"fas fa-cogs fa-sm fa-fw mr-2 text-gray-400\"></i>");
            sb.appendLine("					Settings");
            sb.appendLine("				</a>");
            sb.appendLine("				<a class=\"dropdown-item\" href=\"#\">");
            sb.appendLine("					<i class=\"fas fa-list fa-sm fa-fw mr-2 text-gray-400\"></i>");
            sb.appendLine("					Activity Log");
            sb.appendLine("				</a>");
            sb.appendLine("				<div class=\"dropdown-divider\"></div>");
            sb.appendLine("				<a class=\"dropdown-item\" href=\"#\" data-toggle=\"modal\" data-target=\"#logoutModal\">");
            sb.appendLine("					<i class=\"fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400\"></i>");
            sb.appendLine("					Logout");
            sb.appendLine("				</a>");
            sb.appendLine("			</div>");
            sb.appendLine("		</li>");
        }
        sb.appendLine("	</ul>");
        nav.innerHTML = sb.toString();
        return nav;
    };

    context.getFooter = function () {
        var footer = document.createElement("footer");
        footer.className = "sticky-footer bg-white";
        var sb = new StringBuilder();
        sb.appendLine("	<footer class=\"\">");
        sb.appendLine("	<div class=\"container my-auto\">");
        sb.appendLine("		<div class=\"copyright text-center my-auto\">");
        sb.appendLine("			<span>Copyright &copy; Harvard Disclosure System 2019</span>");
        sb.appendLine("		</div>");
        sb.appendLine("	</div>");
        footer.innerHTML = sb.toString();
        return footer;
    };


    context.addNav = function(){
        var ele = document.getElementById("primary_nav");
        if (ele!=null){
            ele.parentNode.removeChild(ele);
        }
        document.body.insertBefore(context.getNavElement(), document.body.firstChild);
        if (context.cognito.idToken != null){
            $("#create_account_holder").hide();
            $("#uploader_holder").show();
        } else {
            $("#create_account_holder").show();
            $("#uploader_holder").hide();
        }
    };

    context.getVerificationModal = function(){
        var modal = document.createElement("div");
        modal.id = "confirmation_modal";

        var sb = new StringBuilder();
        sb.appendLine("<a style='display:none' id='confirmation_modal_link' class=\"nav-link\" href=\"#\" data-toggle=\"modal\" data-target=\"#ConfirmationModal\">Confirm</a>");
        sb.appendLine("<!-- Modal -->");
        sb.appendLine("<div class=\"modal fade\" id=\"ConfirmationModal\" role=\"dialog\">");
        sb.appendLine("    <div class=\"modal-dialog\">");
        sb.appendLine("        <!-- Modal content-->");
        sb.appendLine("        <div class=\"modal-content\">");
        sb.appendLine("            <div class=\"modal-header\">");
        sb.appendLine("                <h4 class=\"modal-title\">Confirm your Account</h4>");
        sb.appendLine("                <button  id='confirmation_modal_close' type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>");
        sb.appendLine("            </div>");
        sb.appendLine("            <div class=\"modal-body\">");
        sb.appendLine("                <div class=\"form-group\">");
        sb.appendLine("                    <label for=\"confirm_code\">Code received from Email:</label>");
        sb.appendLine("                    <input type=\"text\" class=\"form-control\" id=\"confirm_code\" placeholder=\"ex: 686539\">");
        sb.appendLine("                </div>");
        sb.appendLine("            </div>");
        sb.appendLine("            <div class=\"modal-footer\">");
        sb.appendLine("                <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" onclick=\"HDSApplication.confirm_code();\">Confirm</button>");
        sb.appendLine("            </div>");
        sb.appendLine("        </div>");
        sb.appendLine("    </div>");
        sb.appendLine(" </div>");
        modal.innerHTML = sb.toString();
        return modal;
    };

    context.addVerificationModal = function(callback){
        var ele = document.getElementById("confirmation_modal");
        if (ele!=null){
            ele.parentNode.removeChild(ele);
        }
        ele = context.getVerificationModal();
        if (typeof(callback)=="function"){
            ele.callbackFunction = callback;
        }
        document.body.insertBefore(ele, document.body.firstChild);
        document.getElementById("confirmation_modal_link").click();
    };

    context.confirm_code = function(){
        var ele = document.getElementById("confirmation_modal");
        if (ele!=null){
            var verificationCode = $("#confirm_code").val();
            context.cognito.cognitoUser.confirmRegistration(verificationCode, true, function(error) {
                document.getElementById("confirmation_modal_close").click();
                if (typeof (ele.callbackFunction)=="function"){
                    ele.callbackFunction(error);
                }
            });
        }
    };

    context.user_create = function() {

        var user_username =  $("#create_account_user_username").val();
        if (user_username==null || user_username.trim().length<2){
            alert("Username is too short");
            return false;
        }

        var user_password =  $("#create_account_user_password").val();
        if (user_password==null || user_password.trim().length<8){
            alert("Password must be 8 characters or more");
            return false;
        }
        var user_password2 =  $("#create_account_user_password_repeat").val();
        if (user_password != user_password){
            alert("passwords must match");
            return false;
        }
        var user_email_address =  $("#create_account_user_email_address").val();
        if (user_email_address==null || user_email_address.trim().length<3){
            alert("email address not set");
            return false;
        }
        if ($("#create_account_agree").prop('checked') != true){
            alert("You must agree to the terms of service and that you are 18 years of age in order to create an account.");
            return false;
        }

        try {
            var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'email',
                Value: user_email_address
            });

            context.cognito.userPool.signUp(user_username, user_password, [attributeEmail], null,
                function (err, result) {
                    if (!err) {
                        if (typeof(result.user)!= "undefined" ){
                            context.cognito.cognitoUser = result.user;
                            alert('Registration successful. Please check your email inbox or spam folder for your verification code.');
                            context.addVerificationModal(function(error){
                                if (!error){
                                    $("#login_user_username").val(user_username);
                                    $("#login_user_password").val(user_password);
                                    return context.user_login();
                                }
                                else {
                                    alert(error);
                                }
                            });
                            /*
                            context.cognito.cognitoUser.getSession(function(){

                            });
                            */
                        }


                    } else {
                        alert(err);
                    }
                }
            );
        } catch (err) {
            // code for error
            alert(err.message);
            return false;
        }
    };


    context.user_login = function() {
        try {

            var user_username =  $("#login_user_username").val();
            if (user_username==null || user_username.trim().length<2){
                alert("Username is too short");
                return false;
            }

            var user_password =  $("#login_user_password").val();
            if (user_password==null || user_password.trim().length<8){
                alert("Password must be 8 characters or more");
                return false;
            }

            console.log("logging in");

            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username : user_username,
                Password :  user_password
            });

            var cognitoUser = new AmazonCognitoIdentity.CognitoUser( {
                Username : user_username,
                Pool : context.cognito.userPool
            });
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {

                    console.log("authentication success");

                    context.cognito.accessToken = result.getAccessToken().getJwtToken();
                    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
                    context.cognito.idToken = result.idToken.jwtToken;

                    context.addNav();
                    context.get_files();
                },
                onFailure: function(err) {
                    if ((err + "").indexOf("User is not confirmed.") >=0){
                        var user = context.cognito.cognitoUser;
                        if (user == null){
                            user = context.cognito.createCognitoUser(user_username);
                        }
                        if (user!=null){
                            user.getAttributeVerificationCode('email', {
                                onSuccess: function (v_result) {
                                    console.log('call result: ' + v_result);
                                },
                                onFailure: function(err) {
                                    alert("Verification error:" + err);
                                },
                                inputVerificationCode: function() {
                                    context.addVerificationModal();
                                }
                            });
                        }
                    }
                    else {
                        alert("Login failure: " + err);
                    }
                },

            });

        } catch (err) {
            // code for error
            alert(err.message);
            return false;
        }
    };

    context.user_logout = function() {
        try {
            // code for success
            context.destroySession();
            if (typeof(context.cognito)!="undefined"){
                context.cognito.accessToken = null;
                context.cognito.idToken = null;
                context.cognito.cognitoUser = null;
                if (typeof (context.cognito.userPool)!="undefined"){
                    if (typeof (context.cognito.getCurrentUser)=="function"){
                        var user = context.cognito.userPool.getCurrentUser();
                        if (user!=null){
                            user.signOut();
                        }
                    }
                }
            }
            context.addNav();
            location.reload();
        } catch (err) {
            // code for error
            alert(err.message);
        }
    };


    context.callAPI = function(reqOptions, api, callback){
        if (typeof(reqOptions.url)!="string"){
            var url = context.api.invokeUrl;
            if (typeof (api)=="string"){
                url = url + api;
            }
            reqOptions.url = url;
        }
        if (typeof(reqOptions.data)=="object"){
            reqOptions.data = JSON.stringify(reqOptions.data);
        }
        if (typeof (api)=="function"){
            callback = api;
        }
        context.callAjax(reqOptions, callback);
    };

    context.callAjax = function(reqOptions, callback){
        if (typeof (reqOptions.crossDomain)=="undefined"){
            reqOptions.crossDomain = true;
        }
        if (typeof (reqOptions.type)=="undefined"){
            reqOptions.type = "GET";
        }
        var token = context.cognito.idToken;
        if (token!=null){
            if (typeof(reqOptions.headers)=="object"){
                reqOptions.headers.Authorization = token;
            }
            else {
                reqOptions.headers = {
                    Authorization: token
                };
                console.log("Setting header Authorization (url="+reqOptions.url+"): " + token);
            }
        }
        var request = $.ajax(reqOptions); // contentType: false,
        var callback_callback = false;
        request.fail(function(data, textStatus, xhr){
            var response = data;
            if (typeof(xhr)!='undefined'){
                if (typeof(xhr.status)!='undefined'){
                    if (typeof(xhr.responseText)!='undefined'){
                        response = xhr;
                    }
                }
            }
            if (typeof(response.responseText)!='undefined' && typeof(response.responseJSON)=='undefined') {
                try {
                    response.responseJSON =  JSON.parse(response.responseText);
                } catch (err) {}
            }
            if (!callback_callback && typeof(callback)=='function') {
                callback_callback = true;
                callback(response);
            }
            return true;
        });
        request.always(function(data, textStatus, xhr){
            var response = data;
            if (typeof(xhr)!='undefined'){
                if (typeof(xhr.status)!='undefined'){
                    if (typeof(xhr.responseText)!='undefined'){
                        response = xhr;
                    }
                }
            }
            if (typeof(response.responseText)!='undefined' && typeof(response.responseJSON)=='undefined') {
                try {
                    response.responseJSON =  JSON.parse(response.responseText);
                } catch (err) {}
            }
            if (!callback_callback && typeof(callback)=='function') {
                callback_callback = true;
                callback(response);
            }
            return true;
        });
    };

    context.showModal = function(id){
        var modals = document.getElementsByClassName("modal");
        for (var i in modals){
            var modal = modals[i];
            if (typeof(modal.id)=="undefined" || modal.id != id){
                $(modal).modal("hide");
            }
            else if (typeof(modal.id)=="string" && modal.id == id){
                $(modal).modal("show");
            }
        }
    };

    context.hash = window.location.hash.substr(1);
    context.processHashChange = function(){
        switch (context.hash) {
            case "login":
                context.showModal("login_modal");
                return;
            case "register":
            case "create-account":
                context.showModal("create_account_modal");
                return;
            case "forgot-password":
                context.showModal("forgot_password_modal");
                return;
            default:
                return;
        }
    };

    context.add_events = function(){
        $("#login_user_password").keydown(function (e) {
            if (e.keyCode == 13) {
                context.user_login();
            }
        });
        $("#login_button").click(function (e) {
            context.user_login();
        });
        $("#create_account_user_password").keydown(function (e) {
            if (e.keyCode == 13) {
                context.user_create();
            }
        });
        $("#create_account_button").click(function (e) {
            context.user_create();
        });
        window.addEventListener("hashchange", function(e){
            context.hash = window.location.hash.substr(1);
            context.processHashChange();
        }, false);
    };

    context.removeElement = function(ele){
        if (typeof (ele) == "string"){

        } else {
            ele.parentNode.removeChild(element);
        }
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
    };

    context.getBase64 = function(file, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            if (typeof(callback)=="function"){
                callback(reader.result);
            }
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    context.upload_click = function(){
        var files = [];
        context.file_recurse(files, 1, 0, function(){
            if (files.length > 0){
                context.callAPI({crossDomain: true, type: 'POST', data: files },"file", function(resp){
                    if (typeof(resp.responseJSON) !="object"){
                        resp.responseJSON = eval(resp.responseText);
                    }
                    var str = new StringBuilder();
                    for (var i in resp.responseJSON){
                        var f = resp.responseJSON[i];
                        str.appendLine("<a target='_blank' href=\"javascript:HDSApplication.get_file('" + context.api.invokeUrl +"file/" + f.Key + "');\">" + f.Name + " ("+f.FriendlySize+") <img src='./download.png' height='24'></a><br>" );
                    }
                    document.getElementById('html_body').innerHTML = str.toString();
                });
            }
        });
    };

    context.file_recurse = function(files, f, i, callback){
        var elem = document.getElementById('file' + f);
        if (elem == null){
            callback(files);
        }
        else {
            var files1 = elem.files;
            if (files1.length <= i){
                context.file_recurse(files, f+1, 0, callback);
            }
            else {
                context.getBase64(files1[i], function(str){
                    files.push({ "Name" : files1[i].name, "Data" : str, "Type" : files1[i].type, "Size" : files1[i].size});
                    context.file_recurse(files, f, i+1, callback);
                });
            }
        }
    };

    context.get_file = function(url){
        var req = {
            url: url,
            crossDomain: true,
            type: 'GET'
        };
        context.callAjax(req, function(resp){
            if (typeof(resp.responseJSON) !="object"){
                resp.responseJSON = eval(resp.responseText);
            }
            if (typeof(resp.responseJSON.Key)=="undefined"){
                return;
            }
            var e = document.createElement("a");
            e.id = "download_" + resp.responseJSON.Key.split('.')[1];
            e.download = resp.responseJSON.Name;
            e.style = 'display:none;';
            e.href = resp.responseJSON.Data;
            document.documentElement.appendChild(e);
            e.click();
            e.parentNode.removeChild(e);
        });
    };

    context.get_files = function(){
        context.callAPI({crossDomain: true, type: 'GET'}, "getfiles", function(resp){
            document.getElementById("response_body").innerHTML = resp.responseText;
        });
    };

}

var HDSApplication = new HDSLib();
$(function() {

    // Add the side bar
    //var wrapper = document.getElementById("wrapper");
    //if (typeof(wrapper)!="undefined"){
    //    wrapper.insertBefore(HDSApplication.getSideNav(), wrapper.firstChild);
    //}

    // Add the top bar
    var content = document.getElementById("content");
    if (typeof(content)!="undefined"){
        content.insertBefore(HDSApplication.getTopNav(), content.firstChild);
    }

    var content_wrapper = document.getElementById("content-wrapper");
    if (typeof(content_wrapper)!="undefined"){
        content_wrapper.appendChild(HDSApplication.getFooter());
    }

    // Add the theme script
    HDSApplication.addScript("js/sb-admin-2.min.js", function(){
        HDSApplication.add_events();
        HDSApplication.processHashChange();
    });
});