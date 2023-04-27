export interface Link {
  fullUrl: string,
  domain: string
}
  
export const renderLinksAndTags = (body: string) => {
  let bodyLinks: Link[] = [];
  body = ` ${body} `
  body = body.replace(/([^\s]+:\/\/)/, '');

  const tags = body.match(/[^\s]+;/gm);
  const matches = body.match(/((?:[a-z\d]+\.(?:(?!\ ).)*))/gm)
  if (matches && matches.length > 0) {

    matches.forEach(url => {
      let tempUrl = url.split(/((?:[a-z\d]+\.(?:(?!\/).)*))((?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gm)
     
      tempUrl = tempUrl.filter(function (e) { return e });
      const tempLink: Link = {
        fullUrl: tempUrl[0] + (tempUrl[1] ? tempUrl[1] : ''),
        domain: tempUrl[0]
      }
      bodyLinks.push(tempLink);
    });
  }
  bodyLinks?.forEach(url => {
    if (body.includes(url.fullUrl)) {
      body = body.replace(` ${url.fullUrl} `, ` <a href='//${url.fullUrl}' target='_blank' rel='noreferrer'>${url.domain}</a> `)
    }
  });
  tags?.forEach(t => {
    if (body.includes(t)) {
      body = body.replace(t, `<p>${t}</p>`)
    }
  })
  return body;
}

export const getDomain = (body: string) => {
  let bodyLinks: Link = {fullUrl: '', domain: ''};
  body = body.replace(/([^\s]+:\/\/)/, '');

  const matches = body.match(/((?:[a-z\d]+\.(?:(?!\ ).)*))((?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gm)
  if (matches && matches.length > 0) {

    matches.forEach(url => {
      let tempUrl = url.split(/((?:[a-z\d]+\.(?:(?!\/).)*))((?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gm)
      tempUrl = tempUrl.filter(function (e) { return e });
      const tempLink: Link = {
        fullUrl: tempUrl[0] + (tempUrl[1] ? tempUrl[1] : ''),
        domain: tempUrl[0]
      }
      bodyLinks = tempLink;
    });
  }
  return bodyLinks;
}

