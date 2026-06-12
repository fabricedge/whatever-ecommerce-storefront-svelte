
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
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/account" | "/account/orders" | "/auth" | "/auth/signin" | "/cart" | "/checkout" | "/products" | "/products/[slug]";
		RouteParams(): {
			"/products/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string | undefined };
			"/account": Record<string, never>;
			"/account/orders": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/signin": Record<string, never>;
			"/cart": Record<string, never>;
			"/checkout": Record<string, never>;
			"/products": { slug?: string | undefined };
			"/products/[slug]": { slug: string }
		};
		Pathname(): "/" | "/account/orders" | "/auth/signin" | "/cart" | "/checkout" | "/products" | `/products/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}