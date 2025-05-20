import { cn } from "@/components/cn";
import NavBar from "@/components/NavBar";

export default function RegisterPage() {
  return (
    <div className={cn("min-h-screen flex flex-col items-center bg-gray-50")}> 
      <div className={cn("w-full max-w-md p-6")}> 
        {/* Profile Image Upload */}
        <div className={cn("w-full h-36 bg-gray-200 rounded-lg flex items-center justify-center mb-6 relative")}> 
          <button className={cn("w-12 h-12 bg-white rounded-full flex items-center justify-center shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")}> 
            <span role="img" aria-label="camera">📷</span>
          </button>
        </div>
        {/* Username Input */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
        <input type="text" placeholder="Enter username" className={cn("w-full px-4 py-2 border rounded-lg mb-4")}/>
        {/* Favorite Token */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Favorite Token (Optional)</label>
        <button className={cn("w-full flex items-center justify-between px-4 py-2 border rounded-lg mb-6 bg-white")}>Select token <span>▼</span></button>
        {/* Preview */}
        <div className={cn("bg-white rounded-lg p-4 flex items-center gap-3 border mb-6")}> 
          <div className={cn("w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center")}>👤</div>
          <div>
            <div className="font-semibold">Username</div>
            <div className="text-xs text-gray-400">No token selected</div>
          </div>
        </div>
        {/* Save Button */}
        <button className={cn("w-full bg-black text-white py-2 rounded-lg font-semibold")}>Save</button>
      </div>
      <NavBar />
    </div>
  );
}
