# YouTube to Blogs 

<div align="center">
<a href="https://github.com/debsouryadatta/aiverse">
    <img src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1734703380/projects/Screenshot_2024-12-20_at_7.28.23_PM_puk8vi.png" alt="Logo" width="800" height="500">
  </a>
</div>

<div align="center">
  <h3>Transform YouTube Videos into Engaging Blog Posts</h3>

  <p align="center">
    An AI-powered tool that converts YouTube video content into well-structured, readable blog posts
    <br />
    <a href="https://youtubetoblogs.souryax.tech">View Live Site</a>
    ·
    <a href="https://github.com/debsouryadatta/youtubetoblogs/issues">Report Bug</a>
    ·
    <a href="https://github.com/debsouryadatta/youtubetoblogs/issues">Request Feature</a>
  </p>
</div>

## About The Project

YouTube to Blogs is an AI-powered web application that converts YouTube videos into structured blog posts. It offers features like subtitle extraction, PDF export, local storage, and an interactive chat interface, making content repurposing easy and efficient for everyone.

## Features

- **YouTube to Guided Blogs**: Transform YouTube videos into detailed, structured blog posts
- **Versatile Video Support**: Enhanced blog creation from various video types including YouTube Shorts
- **Export Options**: Export your generated blog posts as PDF files or markdown files with code wrap support
- **Local Storage**: All data saved locally, ensuring privacy with no server sharing or login required
- **Interactive Chat**: Engage with your blog content through a chat interface, with a convenient clear chat feature
- **AI-Powered Conversion**: Intelligent subtitle extraction and content formatting
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Data Management**: Import and export your data from and to the localStorage as JSON files
- **Categorized Posts**: Organize your blog posts with categories in the post gallery
- **Customization**: Change fonts to match your preferred reading style
- **Enhanced Security**: Implemented Arcjet Rate Limiting for improved security

### Built With

- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [OpenAI](https://openai.com/) - OpenAI Library
- [Gemini-2.0-Flash](https://ai.google.dev/gemini-api/docs/openai) - LLM Responses
- [Youtube_API](https://developers.google.com/youtube/v3/getting-started) - YouTube API
- [React-Markdown](https://github.com/remarkjs/react-markdown) - Markdown Parsing
- [Arcjet](https://arcjet.dev/) - Rate Limiting
- [Docker](https://www.docker.com/) - Containerization
- [CI/CD](https://github.com/debsouryadatta/youtubetoblogs/actions) - Continuous Integration and Continuous Delivery

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Git
* Node.js (v18 or higher)
* npm(Node Package Manager)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/debsouryadatta/youtubetoblogs.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env.local` file and add your API keys
   ```sh
   GEMINI_API_KEY=your_api_key
   YOUTUBE_API_KEY=your_api_key
   ```
4. Start the development server
   ```sh
   npm run dev
   ```

### One Click With Docker Compose

1. Build the Docker image & run
   ```sh
   docker-compose up --build -d
   ```

## Usage

1. Navigate to the homepage
2. Click on "Create New Blog Post"
3. Paste your YouTube video URL
4. Wait for the AI to process the video
5. Enjoy your new ai generated blog post
6. Save and share your blog post
7. Start a conversation with your blog post

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Debsourya Datta - [@debsourya005](https://twitter.com/debsourya005)

Project Link: [https://github.com/debsouryadatta/youtubetoblogs](https://github.com/debsouryadatta/youtubetoblogs)
