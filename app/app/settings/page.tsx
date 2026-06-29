'use client'

import { useState } from 'react'
import { useAppState } from '@/components/shell/app-context'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { FieldSet, FieldLegend } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, Lock, Users, Palette, Zap, Shield, Cloud, Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { tenantId } = useAppState()
  const [orgName, setOrgName] = useState('Acme Security Corp')
  const [adminEmail, setAdminEmail] = useState('admin@acmesecurity.com')
  const [notificationsEmail, setNotificationsEmail] = useState('security-alerts@acmesecurity.com')

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <>
      <PageHeader
        title='Settings'
        description='Manage organization, integrations, and preferences'
      />

      <Tabs defaultValue='general' className='w-full space-y-4'>
        <TabsList>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='integrations'>Integrations</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='appearance'>Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Manage your organization settings</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='org-name'>Organization Name</FieldLabel>
                  <Input
                    id='org-name'
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder='Your organization name'
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='admin-email'>Admin Email</FieldLabel>
                  <Input
                    id='admin-email'
                    type='email'
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    placeholder='admin@example.com'
                  />
                  <FieldDescription>Primary contact for system notifications</FieldDescription>
                </Field>
              </FieldGroup>

              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='alert-email'>Alert Email Address</FieldLabel>
                  <Input
                    id='alert-email'
                    type='email'
                    value={notificationsEmail}
                    onChange={e => setNotificationsEmail(e.target.value)}
                    placeholder='alerts@example.com'
                  />
                </Field>
              </FieldGroup>

              <FieldSet>
                <FieldLegend>Alert Types</FieldLegend>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <Checkbox id='critical-alerts' defaultChecked />
                    <label htmlFor='critical-alerts' className='text-sm cursor-pointer'>
                      <span className='font-medium'>Critical Alerts</span>
                      <p className='text-xs text-muted-foreground'>Immediate notification for critical findings</p>
                    </label>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Checkbox id='high-alerts' defaultChecked />
                    <label htmlFor='high-alerts' className='text-sm cursor-pointer'>
                      <span className='font-medium'>High Risk</span>
                      <p className='text-xs text-muted-foreground'>High severity security events</p>
                    </label>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Checkbox id='daily-digest' defaultChecked />
                    <label htmlFor='daily-digest' className='text-sm cursor-pointer'>
                      <span className='font-medium'>Daily Digest</span>
                      <p className='text-xs text-muted-foreground'>Summary of daily activities</p>
                    </label>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Checkbox id='compliance-reports' />
                    <label htmlFor='compliance-reports' className='text-sm cursor-pointer'>
                      <span className='font-medium'>Compliance Reports</span>
                      <p className='text-xs text-muted-foreground'>Scheduled compliance updates</p>
                    </label>
                  </div>
                </div>
              </FieldSet>

              <Button onClick={handleSave}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value='integrations'>
          <div className='space-y-4'>
            {[
              {
                name: 'AWS',
                description: 'Amazon Web Services cloud integration',
                icon: Cloud,
                status: 'connected',
              },
              {
                name: 'Azure',
                description: 'Microsoft Azure cloud platform',
                icon: Cloud,
                status: 'connected',
              },
              {
                name: 'Google Cloud',
                description: 'Google Cloud Platform services',
                icon: Cloud,
                status: 'not-connected',
              },
              {
                name: 'Slack',
                description: 'Send alerts to Slack workspace',
                icon: Mail,
                status: 'connected',
              },
              {
                name: 'Datadog',
                description: 'Monitoring and observability',
                icon: Zap,
                status: 'not-connected',
              },
              {
                name: 'Splunk',
                description: 'Security information and event management',
                icon: Shield,
                status: 'not-connected',
              },
            ].map(integration => {
              const Icon = integration.icon
              return (
                <Card key={integration.name}>
                  <CardContent className='flex items-center justify-between pt-6'>
                    <div className='flex items-center gap-4'>
                      <Icon className='size-8 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>{integration.name}</p>
                        <p className='text-sm text-muted-foreground'>{integration.description}</p>
                      </div>
                    </div>
                    {integration.status === 'connected' ? (
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='size-5 text-green-600' />
                        <Button variant='outline' size='sm'>
                          Manage
                        </Button>
                      </div>
                    ) : (
                      <Button size='sm'>Connect</Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value='security'>
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Manage access and security</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <p className='font-medium'>Two-Factor Authentication</p>
                    <p className='text-sm text-muted-foreground'>Enabled</p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Configure
                  </Button>
                </div>

                <div className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <p className='font-medium'>Session Timeout</p>
                    <p className='text-sm text-muted-foreground'>30 minutes of inactivity</p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Edit
                  </Button>
                </div>

                <div className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <p className='font-medium'>API Keys</p>
                    <p className='text-sm text-muted-foreground'>Manage programmatic access</p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IP Whitelist</CardTitle>
                <CardDescription>Restrict access by IP address</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Shield className='size-4' />
                  <AlertDescription>
                    IP whitelist is currently disabled. Enable it to restrict access to specific IP addresses.
                  </AlertDescription>
                </Alert>
                <div className='mt-4'>
                  <Button size='sm'>Enable IP Whitelist</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value='appearance'>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the platform looks</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>


              <FieldSet>
                <FieldLegend>Sidebar</FieldLegend>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <Checkbox id='sidebar-collapse' />
                    <label htmlFor='sidebar-collapse' className='text-sm cursor-pointer'>
                      Default to collapsed sidebar
                    </label>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Checkbox id='sidebar-icons' defaultChecked />
                    <label htmlFor='sidebar-icons' className='text-sm cursor-pointer'>
                      Show icons only when collapsed
                    </label>
                  </div>
                </div>
              </FieldSet>

              <Button onClick={handleSave}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
