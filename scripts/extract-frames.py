import os
import subprocess
import imageio_ffmpeg

def extract_timeline_frames():
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    video_path = os.path.join("public", "timeline ig.mp4")
    
    if not os.path.exists(video_path):
        print(f"Video file not found at: {video_path}")
        return

    # Output directory for high-performance WebP frames
    webp_dir = os.path.join("public", "timeline-frames")
    os.makedirs(webp_dir, exist_ok=True)
    
    # Output directory for JPG fallback frames
    jpg_dir = os.path.join("public", "timeline-frames-jpg")
    os.makedirs(jpg_dir, exist_ok=True)

    print("Extracting WebP frames (optimized for smooth scroll playback)...")
    cmd_webp = [
        ffmpeg, "-y",
        "-i", video_path,
        "-vf", "fps=30",
        "-c:v", "libwebp",
        "-quality", "85",
        os.path.join(webp_dir, "frame_%03d.webp")
    ]
    subprocess.run(cmd_webp, check=True)

    print("Extracting JPG frames...")
    cmd_jpg = [
        ffmpeg, "-y",
        "-i", video_path,
        "-vf", "fps=30",
        "-q:v", "2",
        os.path.join(jpg_dir, "frame_%03d.jpg")
    ]
    subprocess.run(cmd_jpg, check=True)

    webp_count = len([f for f in os.listdir(webp_dir) if f.endswith(".webp")])
    jpg_count = len([f for f in os.listdir(jpg_dir) if f.endswith(".jpg")])
    print(f"Done! Successfully generated {webp_count} WebP frames in '{webp_dir}' and {jpg_count} JPG frames in '{jpg_dir}'.")

if __name__ == "__main__":
    extract_timeline_frames()
