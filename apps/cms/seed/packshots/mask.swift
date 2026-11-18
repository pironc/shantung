// Usage: mask <in.jpg> <out-mask.png>  writes the foreground subject mask (white = subject) at the image's size.
import Vision
import CoreImage
import Foundation

let a = CommandLine.arguments
guard a.count == 3, let img = CIImage(contentsOf: URL(fileURLWithPath: a[1])) else { print("usage: mask in out"); exit(2) }
let handler = VNImageRequestHandler(ciImage: img)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no subject found"); exit(1) }
let buf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
let mask = CIImage(cvPixelBuffer: buf)
try CIContext().writePNGRepresentation(of: mask, to: URL(fileURLWithPath: a[2]), format: .L8, colorSpace: CGColorSpaceCreateDeviceGray())
print("ok", obs.allInstances.count, "instance(s)")
