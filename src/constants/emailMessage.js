const linkButton = ({ link, linkText }) => {
  return `
  <div style="text-align: center; padding: 20px;">
  <a href="${link}"
    style="color: #fff; background-color: #2ABDEB; padding: 10px 20px; font-size: 1.2rem; text-align: center; text-decoration: none;"
  > ${linkText || link} </a>
  <p style="font-size: 1.5rem; margin-top: 30px; color: #5a5a5a !important">
    Or copy the link below
  <p><br>${link} 
</div>
  `;
};

const template = ({ title, text, link = '' }) => {
  return `
    <div style="color: #5a5a5a;">
      <div style="border-bottom: 1px solid #2ABDEB; padding: 15px;">
        <h2 style="color: #2ABDEB; text-align: center;">Tech Communinty - ${title}</h2>
      </div>
      <p style="font-size: 1.2rem; line-height: 2rem; color: #5a5a5a;">
        ${text}
      <p/>
      ${link}
      <p style="color: #5a5a5a !important;">Thank you, <br> Tech Communinty Team</p>
    </div>
  `;
};

const emailMessage = ({ title, text, link, linkText } = {}) => {
  const withLink = link ? linkButton({ link, linkText }) : '';
  return template({ title, text, link: withLink });
};

export default emailMessage;
