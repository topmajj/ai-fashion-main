"use client"

import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AbTestingAutomation() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">A/B Testing Automation</h1>
        <p className="text-gray-600">Automate A/B testing for your ad creatives and copy.</p>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="adCampaign">Ad Campaign</Label>
            <Input id="adCampaign" placeholder="e.g., Campaign ID" />
          </div>
          <Button>Automate A/B Testing</Button>
        </div>
      </Card>
    </Layout>
  )
}
