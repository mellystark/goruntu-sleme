import cv2
import numpy as np

# Function for Grayscale
def convert_to_grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Function for Blur (Gaussian)
def blur_image(image):
    return cv2.GaussianBlur(image, (15, 15), 0)

# Function for Canny Edge Detection
def canny_edge_detection(image):
    return cv2.Canny(image, 100, 200)

# Function for Harris Corner Detection
def harris_corner_detection(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = np.float32(gray)
    corners = cv2.cornerHarris(gray, 2, 3, 0.04)
    corners = cv2.dilate(corners, None)
    image[corners > 0.01 * corners.max()] = [0, 0, 255]  # Mark corners as red
    return image

# Function for Contour Detection
def contour_detection(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(image, contours, -1, (0, 255, 0), 3)  # Green contours
    return image
