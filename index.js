"use strict";

class Github {
  constructor() {
    this.clientId = "55400152955d21309dfe";
    this.clientSecret = "e657233a8dfd0d65d6a4d7d09b9c300e8cff10e3";
  }

  getUzer(userName) {
    return this.getData(`/users/${userName}`);
  }

  getRepos(userName) {
    return this.getData(`/users/${userName}/repos`);
  }

  async getData(endpoint) {
    const response = await fetch(
      `https://api.github.com${endpoint}?client_id=${this.clientId}&client_secret=${this.clientSecret}`
    );
    return response.json();
  }
}

class UI {
  constructor() {
    this.profile = document.querySelector(".profile");
  }

  showProfile(user) {
    this.profile.innerHTML = `<div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}" alt="avatar">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos"></div>`;
  }

  showError(message) {
    const div = document.createElement("div");
    div.classList.add("alert", "alert-danger", "error");
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".searchContainer");
    const search = document.querySelector(".search");
    container.insertBefore(div, search);
  }

  showRepos(repos) {
    const reposContainer = document.querySelector(".repos");
    reposContainer.innerHTML = "";

    repos.slice(0, 5).forEach((repo) => {
      const repoItem = document.createElement("div");
      repoItem.classList.add("card", "card-body", "mb-2");
      repoItem.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </div>
          <div class="col-md-6">
            <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
            <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
            <span class="badge badge-success">Forks: ${repo.forks_count}</span>
          </div>
        </div>
      `;
      reposContainer.appendChild(repoItem);
    });
  }

  clearUserData() {
    const userDataContainer = document.querySelector(".profile");

    if (!!userDataContainer) {
      userDataContainer.innerHTML = "";
    }
  }

  clearRepos() {
    const reposContainer = document.querySelector(".repos");

    if (!!reposContainer) {
      reposContainer.innerHTML = "";
    }
  }
  clearError() {
    const error = document.querySelector(".error");

    if (!!error) {
      error.remove();
    }
  }
}

const github = new Github();
const ui = new UI();

const searchUser = document.querySelector(".searchUser");
let timer;

searchUser.addEventListener("keyup", (event) => {
  const userText = event.target.value;
  clearTimeout(timer);

  if (userText.trim() !== "") {
    ui.clearUserData();
    ui.clearRepos();
    ui.clearError();

    timer = setTimeout(() => {
      github
        .getUzer(userText)
        .then(async (data) => {
          if (data.message === "Not Found") {
            ui.showError(data.message);
          } else {
            ui.showProfile(data);
            const repos = await github.getRepos(userText);
            ui.showRepos(repos);
          }
        })
        .catch((error) => {
          ui.showError(error.message);
        });
    }, 500);
  } else {
    ui.clearRepos();
  }
});
