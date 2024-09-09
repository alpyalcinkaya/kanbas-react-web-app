import React from 'react';

export default function Lab1() {
    return (
    <div id="wd-lab1">
        <h2>Lab 1</h2>
        <h3>HTML Examples</h3>
        <div id="wd-h-tag">
            <h4>Heading Tags</h4>
            Text documents are often broken up into several sections and subsections. Each section is usually prefaced with a short title or heading that attempts to summarize the topic of the section it precedes. For instance this paragraph is preceded by the heading Heading Tags. The font of the section headings are usually larger and bolder than their subsection headings. This document uses headings to introduce topics such as HTML Documents, HTML Tags, Heading Tags, etc. HTML heading tags can be used to format plain text so that it renders in a browser as large headings. There are 6 heading tags for different sizes: h1, h2, h3, h4, h5, and h6. Tag h1 is the largest heading and h6 is the smallest heading.
        </div>

        <div id="wd-p-tag">
            <h4>Paragraph Tag</h4>
            <p id="wd-p-1"> ... </p>
            <p id="wd-p-2">
                This is the first paragraph. The paragraph tag is used to format
                vertical gaps between long pieces of text like this one.
            </p>

            <p id="wd-p-3">
                This is the second paragraph. Even though there is a deliberate white
                gap between the paragraph above and this paragraph, by default
                browsers render them as one contiguous piece of text as shown here on
                the right.
            </p>

            <p id="wd-p-4">
            This is the third paragraph. Wrap each paragraph with the paragraph
            tag to tell browsers to render the gaps.

            </p>
        </div>

        <div id="wd-lists">
            <h4>List Tags</h4>
            <h5>Ordered List Tag</h5>
            How to make pancakes:
            <ol id="wd-pancakes">
                <li>Mix dry ingredients.</li>
                <li>Add wet ingredients.</li>
                <li>Stir to combine.</li>
                <li>Heat a skillet or griddle.</li>
                <li>Pour batter onto the skillet.</li>
                <li>Cook until bubbly on top.</li>
                <li>Flip and cook the other side.</li>
                <li>Serve and enjoy!</li>
            </ol>
            My Favorite Recipe:
            <ol id="wd-your-favorite-recipe">
                <li>Chop onions and green bell peppers</li>
                <li>On a stove, add some butter on medium-high heat</li>
                <li>Wait until butter has melted and is shimmering</li>
                <li>Add onions and bell pepperes, cook until onions are transparent</li>
                <li>Add in minced meat, cook thorougly</li>
                <li>Add two tablespoons of tomato paste</li>
                <li>Add tomato juice</li>
                <li>Add salt, pepper and garlic to taste</li>
                <li>Set stove on low-heat until simmering, let sauce simmer for no less than 5 hours</li>
                <li>Cook your favorite pasta, pour sauce on pasta</li>
                <li>Serve and enjoy!</li>
            </ol>

            <h5>Unordered List Tag</h5>
            My favorite books (in no particular order)
            <ul id="wd-my-books">
                <li>Dune</li>
                <li>Lord of the Rings</li>
                <li>Ender's Game</li>
                <li>Red Mars</li>
                <li>The Forever War</li>
            </ul>
            Your favorite books (in no particular order)
            <ul id="wd-your-books">
                <li>Talon Of Horus</li>
                <li>Meditations</li>
                <li>The Name of The Wind</li>
                <li>A Game Of Thrones</li>
            </ul>
        </div>

        <div id="wd-tables">
            <h4>Table Tag</h4>
            <table border={1} width="100%">
            <thead>
                <tr>
                <th>Quiz</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Grade</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Q1</td>
                <td>HTML</td>
                <td>2/3/21</td>
                <td>85</td>
                </tr>
                <tr>
                <td>Q2</td>
                <td>CSS</td>
                <td>2/10/21</td>
                <td>90</td>
                </tr>
                <tr>
                <td>Q3</td>
                <td>JavaScript</td>
                <td>2/17/21</td>
                <td>95</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                <td colSpan={3}>Average</td>
                <td>90</td>
                </tr>
            </tfoot>
            </table>
        </div>
        <div id="wd-images">
            <h4>Image tag</h4>
            Loading an image from the internet:
            <br />
            <img id="wd-starship"
                width="400px"
            src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
            />
            <br />
            Loading a local image:
            <br />
            <img id="wd-teslabot" src="images/teslabot.jpg" height="200px" />
        </div>

    </div>

      
    );
  }
  