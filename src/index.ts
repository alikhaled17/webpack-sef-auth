import "./index.css";

export const greet = () => {
  return "Hello Home!";
};

const main = () => {
  alert("Home");
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
