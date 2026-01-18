import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AppLayout from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

export default function Debug() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) {
    return (
      <AppLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Not logged in</h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Debug Info</h1>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Auth User Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Auth User</h2>
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span> {user.id}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span> {user.email}
                </div>
              </div>
            </Card>

            {/* Database User Record */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Database User Record</h2>
              {userData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Business Name</div>
                      <div className="font-medium">
                        {userData.business_name || (
                          <span className="text-destructive">❌ NOT SET</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Phone Number</div>
                      <div className="font-medium">
                        {userData.phone_number || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Vapi Phone</div>
                      <div className="font-medium">
                        {userData.vapi_phone_number || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Booking Link</div>
                      <div className="font-medium">
                        {userData.booking_link || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      Show full record (JSON)
                    </summary>
                    <pre className="mt-3 p-4 bg-secondary rounded-lg text-xs overflow-auto">
                      {JSON.stringify(userData, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-destructive">No user record found in database!</div>
              )}
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <h3 className="font-semibold mb-2">What This Tells You:</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>
                  <strong>If Business Name shows "❌ NOT SET":</strong> You need to enter it in Settings
                  and save. This is why Dashboard shows "Dashboard" instead of your business name.
                </li>
                <li>
                  <strong>After saving in Settings:</strong> Come back here and click Refresh to verify
                  the data was saved to the database.
                </li>
                <li>
                  <strong>If data appears here but not on Dashboard:</strong> The Dashboard query cache
                  needs invalidation (the fix I just pushed).
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
