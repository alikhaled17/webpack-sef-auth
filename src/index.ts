import "./index.css";

export const greet = () => {
  return "Hello Home!";
};

const main = () => {
  alert("Home");
  console.log(greet());
  setTimeout(() => {
    window.location.href = "login";
  }, 500);
};

main();
