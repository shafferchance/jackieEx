# Techonologies utilized
- Node.js (JS runtime that is powered by Google's V8 JS engine(c++))
- Express (middleware to take care of the routing boilerplate)
- Body Parser (So that data will be formatted as expected in body element of HTTP Req Object)
- Native Web Components (customElements and ShadowDOM)

### Basic layout
Server serves static content
Static will collect player information
Initial players with server and begin match
Utilizing PubSub System Players will subscribe to state updates
Front end wil react to state updates through messaging system