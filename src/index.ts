import "./index.css";

export const greet = () => {
  return "Hello Home!";
};

const main = () => {
  console.log(greet());
  setTimeout(() => {
    if (
      !window.location.href.includes("login") ||
      !window.location.href.includes("signup")
    )
      window.location.href = "login";
  }, 500);
};

main();
