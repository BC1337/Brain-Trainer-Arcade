
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/aim-trainer" | "/api" | "/api/auth" | "/api/auth/login" | "/api/auth/signup" | "/api/highscore" | "/api/highscore/[game]" | "/api/user" | "/api/user/highscore" | "/api/user/highscore/[game]" | "/chimp-test" | "/connections" | "/dashboard" | "/games" | "/login" | "/memory-trainer" | "/reaction-timer" | "/signup" | "/simon-says" | "/type-racer" | "/word-game" | "/word-game/how-to-play";
		RouteParams(): {
			"/api/highscore/[game]": { game: string };
			"/api/user/highscore/[game]": { game: string }
		};
		LayoutParams(): {
			"/": { game?: string };
			"/aim-trainer": Record<string, never>;
			"/api": { game?: string };
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/signup": Record<string, never>;
			"/api/highscore": { game?: string };
			"/api/highscore/[game]": { game: string };
			"/api/user": { game?: string };
			"/api/user/highscore": { game?: string };
			"/api/user/highscore/[game]": { game: string };
			"/chimp-test": Record<string, never>;
			"/connections": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/games": Record<string, never>;
			"/login": Record<string, never>;
			"/memory-trainer": Record<string, never>;
			"/reaction-timer": Record<string, never>;
			"/signup": Record<string, never>;
			"/simon-says": Record<string, never>;
			"/type-racer": Record<string, never>;
			"/word-game": Record<string, never>;
			"/word-game/how-to-play": Record<string, never>
		};
		Pathname(): "/" | "/aim-trainer" | "/aim-trainer/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/signup" | "/api/auth/signup/" | "/api/highscore" | "/api/highscore/" | `/api/highscore/${string}` & {} | `/api/highscore/${string}/` & {} | "/api/user" | "/api/user/" | "/api/user/highscore" | "/api/user/highscore/" | `/api/user/highscore/${string}` & {} | `/api/user/highscore/${string}/` & {} | "/chimp-test" | "/chimp-test/" | "/connections" | "/connections/" | "/dashboard" | "/dashboard/" | "/games" | "/games/" | "/login" | "/login/" | "/memory-trainer" | "/memory-trainer/" | "/reaction-timer" | "/reaction-timer/" | "/signup" | "/signup/" | "/simon-says" | "/simon-says/" | "/type-racer" | "/type-racer/" | "/word-game" | "/word-game/" | "/word-game/how-to-play" | "/word-game/how-to-play/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/GameSounds/beep.mp3" | "/GameSounds/buzzer.mp3" | "/GameSounds/game1.mp3" | "/GameSounds/game2.mp3" | "/GameSounds/game3.mp3" | "/GameSounds/game4.mp3" | "/GameSounds/game5.mp3" | "/GameSounds/game6.mp3" | "/GameSounds/game7.mp3" | "/GameSounds/game8.mp3" | "/GameSounds/game9.mp3" | "/favicon.png" | "/simon-says.jpg" | string & {};
	}
}