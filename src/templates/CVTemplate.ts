import type { IHeader } from "../models/Header.model.js";
import type { ISkill } from "../models/Skill.model.js";
import type { IExperience } from "../models/Experience.model.js";
import type { IProject } from "../models/Project.model.js";
import type { IEducation } from "../models/Education.model.js";
import type { ICertification } from "../models/Certification.model.js";

interface CreateCVHTMLParams {
  header: IHeader;
  professional_summary?: string;
  skills?: ISkill[];
  experience?: IExperience[];
  projects?: IProject[];
  education?: IEducation[];
  certifications?: ICertification[];
  languages?: string[];
}

export const createCVHTML = ({
  header,
  professional_summary,
  skills = [],
  experience = [],
  projects = [],
  education = [],
  certifications = [],
  languages = [],
}: CreateCVHTMLParams): string => {

  const social = header.socialmediadetails || [];
  const findSocial = (name: string) =>
    social.find(s => s.name?.toLowerCase() === name.toLowerCase())?.url;

  const LINK_COLOR = "#3b82f6";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${header.fullname} Resume</title>

<style>
  * { box-sizing: border-box; }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    line-height: 1.55;
    color: #1f2937;
    margin: 0;
    background: #ffffff;
  }

  .container { width: 100%; }

  /* LINKS */
  a {
    color: ${LINK_COLOR};
    text-decoration: none;
  }
  a:hover { text-decoration: underline; }

  /* HEADER */
  .header {
    margin-bottom: 14px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 6px;
  }

  .name {
    font-size: 26px;
    font-weight: 700;
    margin: 0;
  }

  .title {
    font-size: 13px;
    color: ${LINK_COLOR};
    font-weight: 600;
    margin: 4px 0 6px;
  }

  .contact {
    font-size: 10.5px;
    color: #374151;
  }

  .contact span {
    margin-right: 10px;
  }

  /* SECTION */
  .section {
    margin-top: 12px;
  }

  .section-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 6px;
    padding-bottom: 2px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .left { width: 75%; }
  .right {
    width: 25%;
    text-align: right;
    font-size: 10.5px;
    color: #374151;
    white-space: nowrap;
  }

  ul {
    margin: 4px 0 6px 16px;
    padding: 0;
  }

  li { margin-bottom: 3px; }

  .sub {
    color: #4b5563;
    font-size: 10.6px;
  }
</style>
</head>

<body>
<div class="container">

<!-- HEADER -->
<div class="header">
  <div class="name">${header.fullname}</div>
  <div class="title">${header.jobtitle}</div>

<div class="contact">

  <!-- ROW 1 -->
  <div style="display:flex; flex-wrap:wrap; gap:14px;">
    ${header.email ? `<span><strong>Email:</strong> ${header.email}</span>` : ""}
    ${header.phone ? `<span><strong>Phone:</strong> ${header.phone}</span>` : ""}
  </div>

  <!-- ROW 2 -->
  <div style="display:flex; flex-wrap:wrap; gap:14px; margin-top:4px;">
    ${findSocial("github")
      ? `<span><strong>GitHub:</strong> <a href="${findSocial("github")}">${findSocial("github")}</a></span>`
      : ""}

    ${findSocial("linkedin")
      ? `<span><strong>LinkedIn:</strong> <a href="${findSocial("linkedin")}">${findSocial("linkedin")}</a></span>`
      : ""}

    ${findSocial("website")
      ? `<span><strong>Portfolio:</strong> <a href="${findSocial("website")}">${findSocial("website")}</a></span>`
      : ""}

    ${findSocial("x") || findSocial("twitter")
      ? `<span><strong>X:</strong> <a href="${findSocial("x") || findSocial("twitter")}">${findSocial("x") || findSocial("twitter")}</a></span>`
      : ""}
  </div>

</div>


<!-- SUMMARY -->
${professional_summary ? `
<div class="section">
  <div class="section-title">Professional Summary</div>
  <p>${professional_summary}</p>
</div>` : ""}

<!-- EXPERIENCE -->
${experience.length ? `
<div class="section">
  <div class="section-title">Experience</div>
  ${experience.map(e => `
    <div class="row">
      <div class="left">
        <strong>${e.jobtitle}</strong> —
        ${e.companyWebsiteLink
          ? `<a href="${e.companyWebsiteLink}">${e.companyname}</a>`
          : e.companyname}
        <div class="sub">${e.location} | ${e.jobtype}</div>
      </div>
      <div class="right">${e.startdate} – ${e.enddate}</div>
    </div>
    <ul>
      ${e.responsibilities
        .split("\n")
        .filter(r => r.trim())
        .map(r => `<li>${r}</li>`).join("")}
    </ul>
  `).join("")}
</div>` : ""}

<!-- PROJECTS -->
${projects.length ? `
<div class="section">
  <div class="section-title">Projects</div>
  ${projects.map(p => `
    <p>
      <strong>
        ${p.gitHuborliveurl
          ? `<a href="${p.gitHuborliveurl}">${p.projectname}</a>`
          : p.projectname}
      </strong>
      ${p.technologiesused?.length
        ? ` | ${p.technologiesused.map(t => t.techname).join(", ")}`
        : ""}
    </p>
    <ul>
      <li>${p.description}</li>
    </ul>
  `).join("")}
</div>` : ""}

<!-- SKILLS -->
${skills.length ? `
<div class="section">
  <div class="section-title">Technical Skills</div>
  ${skills.map(s => `
    <p>
      <strong>${s.mainskillname}:</strong>
      ${s.subskills?.map(sub => sub.subskillname).join(", ")}
    </p>
  `).join("")}
</div>` : ""}

<!-- EDUCATION -->
${education.length ? `
<div class="section">
  <div class="section-title">Education</div>
  ${education.map(e => `
    <div class="row">
      <div class="left">
        <strong>${e.institution}</strong>
        <div class="sub">${e.degreename}</div>
      </div>
      <div class="right">${e.duration}</div>
    </div>
  `).join("")}
</div>` : ""}

<!-- CERTIFICATIONS -->
${certifications.length ? `
<div class="section">
  <div class="section-title">Certifications</div>
  <ul>
    ${certifications.map(c => `<li>${c.certificatename}</li>`).join("")}
  </ul>
</div>` : ""}

<!-- LANGUAGES -->
${languages.length ? `
<div class="section">
  <div class="section-title">Languages</div>
  <p>${languages.join(", ")}</p>
</div>` : ""}

</div>
</body>
</html>
`;
};


