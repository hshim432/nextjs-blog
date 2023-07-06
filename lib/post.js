import path from "path";
import * as fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

//mdファイルの中身を取得する
export function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  console.log(fileNames);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, ""); //ファイル名

    //mdファイルを文字列として取得
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    //idとmdファイルの中身を返す
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData;
}

//getStaticPathsでreturnで使うPAthを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

//idからブログ投稿データを返す

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}
