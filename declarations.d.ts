declare module 'js-beautify' {
  const beautify: {
    html: (input: string, options?: any) => string;
    js: (input: string, options?: any) => string;
    css: (input: string, options?: any) => string;
  };
  export = beautify;
}