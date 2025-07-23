# ASCII Maker

<pre>
 █████╗ ███████╗ ██████╗██╗██╗    ███╗   ███╗ █████╗ ██╗  ██╗███████╗██████╗ 
██╔══██╗██╔════╝██╔════╝██║██║    ████╗ ████║██╔══██╗██║ ██╔╝██╔════╝██╔══██╗ 
███████║███████╗██║     ██║██║    ██╔████╔██║███████║█████╔╝ █████╗  ██████╔╝ 
██╔══██║╚════██║██║     ██║██║    ██║╚██╔╝██║██╔══██║██╔═██╗ ██╔══╝  ██╔══██╗ 
██║  ██║███████║╚██████╗██║██║    ██║ ╚═╝ ██║██║  ██║██║  ██╗███████╗██║  ██║ 
╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ 
</pre>

A modern web application that converts images and text into ASCII art. Built with Next.js 15, TypeScript, Shadcn, and Tailwind CSS.

## ✨ Features

- **Image Upload**: Support for multiple image formats (PNG, JPG, JPEG, GIF, WebP)
- **Real-time Preview**: See your ASCII art generated instantly
- **Customizable Settings**:
  - Adjustable character width (10-200 characters)
  - Multiple ASCII character sets (simple, detailed, blocks, custom)
  - Color/grayscale toggle
  - Fidelity settings (Image only)
- **Export Options**: Copy to clipboard, download as image, or download as text file
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Demo (coming soon)

[Live Demo](https://demo-url.vercel.app)


## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Image Processing**: HTML5 Canvas API
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 22.0 or later
- npm, yarn, or pnpm package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ascii-maker.git
   cd ascii-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage

1. **Upload an Image**: Click the upload area or drag and drop an image file
2. **Adjust Settings**: 
   - Set the desired width for your ASCII art
   - Choose a character set that fits your style
   - Fine-tune brightness and contrast
   - Toggle between color and grayscale output
3. **Generate**: The ASCII art will be generated automatically as you adjust settings. Text will render canvas art and Figlet fonts.
4. **Export**: Copy the result to clipboard or download as a text file

### Performance Settings

For optimal performance with large images:
- Recommended max width: 100-150 characters
- Images are automatically resized to maintain aspect ratio
- Processing is done client-side for privacy

## 🔄 Algorithm

The ASCII conversion process:

1. **Image Loading**: Load and validate the uploaded image
2. **Canvas Rendering**: Draw image to HTML5 canvas for pixel manipulation
3. **Pixel Sampling**: Extract pixel data and convert to grayscale values
4. **Character Mapping**: Map brightness values to ASCII characters
5. **Output Generation**: Construct the final ASCII string with proper formatting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or run into issues, please:

1. Check the [Issues](https://github.com/dwjanus/ascii-maker/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible including:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior

## 🔮 Roadmap
- [ ] Refactor, housekeeping, and performance optimizations
- [ ] Batch processing for multiple images
- [ ] More character sets and themes
- [ ] Selectable character sets
- [ ] Animation support for GIFs
- [ ] Social sharing features
- [ ] API endpoint for programmatic access

---

Made with ❤️ by [Devin](https://github.com/dwjanus)
```

