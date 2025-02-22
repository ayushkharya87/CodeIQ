import React, { useEffect, useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import MarkDown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

const App = () => {
  const [code, setCode] = useState(``);
  const [review, setReview] = useState(``);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    // const response = await axios.post('http://localhost:3000/ai/get-review', { code });
    const response = await axios.post('https://codeiq-server.onrender.com/ai/get-review', { code });

    const reviewText = response.data;
    setReview(""); // Clear previous review
  
    let i = 0;
    function typeEffect() {
      if (i < reviewText.length) {
        setReview((prev) => prev + reviewText.charAt(i));
        i++;
        setTimeout(typeEffect, 1); // Adjust speed (20ms per character)
      }
    }
    
    typeEffect();
  }
  

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor placeholder="Write your code here..."
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                borderRadius: 5,
              }}
            ></Editor>
          </div>
          <div className="review" onClick={reviewCode}>Review</div>
        </div>
        <div className="right">
        <div className={`right ${review ? "typing" : ""}`}>
  <MarkDown rehypePlugins={[rehypeHighlight]}>{review}</MarkDown>
</div>

        </div>
      </main>
    </>
  );
};

export default App;
