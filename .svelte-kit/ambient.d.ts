
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const DATABASE_URL: string;
	export const JWT_SECRET: string;
	export const SHELL: string;
	export const npm_command: string;
	export const SESSION_MANAGER: string;
	export const QT_ACCESSIBILITY: string;
	export const SNAP_REVISION: string;
	export const COLORTERM: string;
	export const XDG_CONFIG_DIRS: string;
	export const NVM_INC: string;
	export const XDG_MENU_PREFIX: string;
	export const TERM_PROGRAM_VERSION: string;
	export const XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const SNAP_REAL_HOME: string;
	export const SNAP_USER_COMMON: string;
	export const GNOME_KEYRING_CONTROL: string;
	export const GDK_BACKEND_VSCODE_SNAP_ORIG: string;
	export const FONTCONFIG_PATH: string;
	export const NODE: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GIO_MODULE_DIR_VSCODE_SNAP_ORIG: string;
	export const SSH_AUTH_SOCK: string;
	export const XDG_DATA_HOME: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const SNAP_INSTANCE_KEY: string;
	export const npm_config_local_prefix: string;
	export const XMODIFIERS: string;
	export const DESKTOP_SESSION: string;
	export const GTK_MODULES: string;
	export const SNAP_EUID: string;
	export const PWD: string;
	export const GSETTINGS_SCHEMA_DIR: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LOGNAME: string;
	export const GTK_EXE_PREFIX: string;
	export const XDG_SESSION_TYPE: string;
	export const SYSTEMD_EXEC_PID: string;
	export const _: string;
	export const XAUTHORITY: string;
	export const TEMPDIR: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const SNAP_CONTEXT: string;
	export const HOME: string;
	export const USERNAME: string;
	export const IM_CONFIG_PHASE: string;
	export const LANG: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const VTE_VERSION: string;
	export const WAYLAND_DISPLAY: string;
	export const SNAP_ARCH: string;
	export const SNAP_INSTANCE_NAME: string;
	export const SNAP_USER_DATA: string;
	export const TMPDIR: string;
	export const GIT_ASKPASS: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const QTWEBENGINE_DICTIONARIES_PATH: string;
	export const SNAP_REEXEC: string;
	export const SNAP_UID: string;
	export const CHROME_DESKTOP: string;
	export const npm_lifecycle_script: string;
	export const NVM_DIR: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const GNOME_SETUP_DISPLAY: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: string;
	export const GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG: string;
	export const LESSCLOSE: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const npm_package_name: string;
	export const GTK_PATH: string;
	export const LESSOPEN: string;
	export const USER: string;
	export const GTK_PATH_VSCODE_SNAP_ORIG: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const SNAP: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const SNAP_COMMON: string;
	export const SNAP_VERSION: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const NVM_CD_FLAGS: string;
	export const SNAP_LIBRARY_PATH: string;
	export const GSM_SKIP_SSH_AGENT_WORKAROUND: string;
	export const SNAP_COOKIE: string;
	export const QT_IM_MODULE: string;
	export const XDG_DATA_HOME_VSCODE_SNAP_ORIG: string;
	export const GTK_EXE_PREFIX_VSCODE_SNAP_ORIG: string;
	export const npm_config_user_agent: string;
	export const SNAP_DATA: string;
	export const npm_execpath: string;
	export const FC_FONTATIONS: string;
	export const LD_LIBRARY_PATH: string;
	export const XDG_RUNTIME_DIR: string;
	export const XDG_DATA_DIRS_VSCODE_SNAP_ORIG: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_json: string;
	export const SNAP_NAME: string;
	export const FONTCONFIG_FILE: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const XDG_DATA_DIRS: string;
	export const GDK_BACKEND: string;
	export const PATH: string;
	export const GDMSESSION: string;
	export const GTK_IM_MODULE_FILE: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const NVM_BIN: string;
	export const LOCPATH_VSCODE_SNAP_ORIG: string;
	export const GIO_MODULE_DIR: string;
	export const npm_node_execpath: string;
	export const OLDPWD: string;
	export const TERM_PROGRAM: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		DATABASE_URL: string;
		JWT_SECRET: string;
		SHELL: string;
		npm_command: string;
		SESSION_MANAGER: string;
		QT_ACCESSIBILITY: string;
		SNAP_REVISION: string;
		COLORTERM: string;
		XDG_CONFIG_DIRS: string;
		NVM_INC: string;
		XDG_MENU_PREFIX: string;
		TERM_PROGRAM_VERSION: string;
		XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: string;
		GNOME_DESKTOP_SESSION_ID: string;
		SNAP_REAL_HOME: string;
		SNAP_USER_COMMON: string;
		GNOME_KEYRING_CONTROL: string;
		GDK_BACKEND_VSCODE_SNAP_ORIG: string;
		FONTCONFIG_PATH: string;
		NODE: string;
		GNOME_SHELL_SESSION_MODE: string;
		GIO_MODULE_DIR_VSCODE_SNAP_ORIG: string;
		SSH_AUTH_SOCK: string;
		XDG_DATA_HOME: string;
		MEMORY_PRESSURE_WRITE: string;
		SNAP_INSTANCE_KEY: string;
		npm_config_local_prefix: string;
		XMODIFIERS: string;
		DESKTOP_SESSION: string;
		GTK_MODULES: string;
		SNAP_EUID: string;
		PWD: string;
		GSETTINGS_SCHEMA_DIR: string;
		XDG_SESSION_DESKTOP: string;
		LOGNAME: string;
		GTK_EXE_PREFIX: string;
		XDG_SESSION_TYPE: string;
		SYSTEMD_EXEC_PID: string;
		_: string;
		XAUTHORITY: string;
		TEMPDIR: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		SNAP_CONTEXT: string;
		HOME: string;
		USERNAME: string;
		IM_CONFIG_PHASE: string;
		LANG: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		MEMORY_PRESSURE_WATCH: string;
		VTE_VERSION: string;
		WAYLAND_DISPLAY: string;
		SNAP_ARCH: string;
		SNAP_INSTANCE_NAME: string;
		SNAP_USER_DATA: string;
		TMPDIR: string;
		GIT_ASKPASS: string;
		GNOME_TERMINAL_SCREEN: string;
		QTWEBENGINE_DICTIONARIES_PATH: string;
		SNAP_REEXEC: string;
		SNAP_UID: string;
		CHROME_DESKTOP: string;
		npm_lifecycle_script: string;
		NVM_DIR: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		GNOME_SETUP_DISPLAY: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: string;
		GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG: string;
		LESSCLOSE: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		npm_package_name: string;
		GTK_PATH: string;
		LESSOPEN: string;
		USER: string;
		GTK_PATH_VSCODE_SNAP_ORIG: string;
		VSCODE_GIT_IPC_HANDLE: string;
		SNAP: string;
		GNOME_TERMINAL_SERVICE: string;
		SNAP_COMMON: string;
		SNAP_VERSION: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		NVM_CD_FLAGS: string;
		SNAP_LIBRARY_PATH: string;
		GSM_SKIP_SSH_AGENT_WORKAROUND: string;
		SNAP_COOKIE: string;
		QT_IM_MODULE: string;
		XDG_DATA_HOME_VSCODE_SNAP_ORIG: string;
		GTK_EXE_PREFIX_VSCODE_SNAP_ORIG: string;
		npm_config_user_agent: string;
		SNAP_DATA: string;
		npm_execpath: string;
		FC_FONTATIONS: string;
		LD_LIBRARY_PATH: string;
		XDG_RUNTIME_DIR: string;
		XDG_DATA_DIRS_VSCODE_SNAP_ORIG: string;
		DEBUGINFOD_URLS: string;
		npm_package_json: string;
		SNAP_NAME: string;
		FONTCONFIG_FILE: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		XDG_DATA_DIRS: string;
		GDK_BACKEND: string;
		PATH: string;
		GDMSESSION: string;
		GTK_IM_MODULE_FILE: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		NVM_BIN: string;
		LOCPATH_VSCODE_SNAP_ORIG: string;
		GIO_MODULE_DIR: string;
		npm_node_execpath: string;
		OLDPWD: string;
		TERM_PROGRAM: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
