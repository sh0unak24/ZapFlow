"use client"

import { AppBar } from "@/components/AppBar"
import { DarkButton } from "@/components/buttons/DarkButton"
import { SpinnerLoader } from "@/components/Loader"
import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config"
import { Zap } from "../types/zap"
import { useRouter } from "next/navigation"

function useZaps() {
  const [loading, setLoading] = useState(true)
  const [zaps, setZaps] = useState<Zap[]>([])
  
  useEffect(() => {
    const fetchZaps = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/zap/me`,
          { withCredentials: true }
        )
        setZaps(res.data.zaps)
      } catch (err) {
        console.error("Failed to fetch zaps", err)
      } finally {
        setLoading(false)
      }
    }

    fetchZaps()
  }, [])

  return { loading, zaps }
}



export default function Dashboard() {
  const { loading, zaps } = useZaps()
  const router = useRouter()

  function routeUser(){
    router.push("dashboard/zap/create")
  }

  return (
    <div className="z-0 mt-20">
      <AppBar />

      <div className="flex justify-center pt-10">
        <div className="w-full max-w-5xl">

          {loading ? (
            <div className="flex flex-col items-center gap-3 mt-20">
              <SpinnerLoader />
              <p className="text-gray-500">Loading Zaps...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold">
                  My Zaps
                </span>
                <DarkButton onClick={routeUser}>
                  Create
                </DarkButton>
              </div>

              {zaps.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No zaps created yet
                </p>
              ) : (
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                Zap Name
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                Trigger
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                            <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">
                                Count
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {zaps.map((zap) => (
                        <tr
                            onClick={() => {
                              router.push("/zap" + zap.id)
                            }}
                            key={zap.id}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-3 font-medium">
                              {zap.name}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {zap.trigger?.type?.name ?? "Unknown"}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {zap.actions.map(action => action.name).join(", ")}
                            </td>

                            <td className="px-4 py-3 text-right text-gray-500">
                              {zap.actions.length}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}