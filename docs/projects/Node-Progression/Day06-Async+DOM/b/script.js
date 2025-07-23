const howls = [
  {
    user: "@student",
    message: "This is a sample howl. #example"
  },
  {
    user: "@graduate",
    message: "Another sample howl for the feed!"
  },
  {
    user: "@student",
    message: "This is a sample howl. #example"
  },
  {
    user: "@faculty",
    message: "This is a sample howl. #example"
  },
  {
    user: "@student",
    message: "This is a sample howl. #example"
  },
  {
    user: "@graduate",
    message: "This is a sample howl. #example"
  },
  {
    user: "@graduate",
    message: "Yet another howl to showcase the feed layout."
  }
];

/* HTML to Create
<div class="howl container">
  <div class="user">@user3</div>
  <div class="content">Yet another howl to showcase the feed layout.</div>
  <div class="actions">
    <a href="#">Reply</a>
    <a href="#">Rehowl</a>
    <a href="#">Like</a>
  </div>
</div>
*/

const howlContainer = document.querySelector("#howl-list");

howls.forEach((howl) => {
  // Whole item
  const howlItem = document.createElement("div");
  howlItem.classList.add("howl", "container");
  howlContainer.appendChild(howlItem);

  // Nested div's
  const howlUser = document.createElement("div");
  howlUser.classList.add("user");
  howlUser.textContent = howl.user;
  howlItem.appendChild(howlUser);

  const howlContent = document.createElement("div");
  howlContent.className = "content";
  howlContent.textContent = howl.message;
  howlUser.appendChild(howlContent);

  const howlActions = document.createElement("div");
  howlActions.className = "actions";
  howlUser.appendChild(howlActions);

  // Nested links
  const howlActionsReply = document.createElement("a");
  howlActionsReply.href = "#";
  howlActionsReply.textContent = "Reply";
  howlActions.appendChild(howlActionsReply);

  const howlActionsRehowl = document.createElement("a");
  howlActionsRehowl.href = "#";
  howlActionsRehowl.textContent = "Rehowl";
  howlActions.appendChild(howlActionsRehowl);

  const howlActionsLike = document.createElement("a");
  howlActionsLike.href = "#";
  howlActionsLike.textContent = "Like";
  howlActions.appendChild(howlActionsLike);
});