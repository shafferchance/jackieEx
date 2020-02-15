# Techonologies utilized
- Node.js (JS runtime that is powered by Google's V8 JS engine(c++))
- Express (middleware to take care of the routing boilerplate)
- Body Parser (So that data will be formatted as expected in body element of HTTP Req Object)
- Native Web Components (customElements and ShadowDOM)

### Abstract execution of web side
1. Server serves static content
2. Static will collect player information
3. Initial players with server and begin match
4. Utilizing PubSub System Players will subscribe to state updates
5. Front end wil react to state updates through messaging systemg