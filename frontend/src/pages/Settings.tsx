import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  User as UserIcon, 
  Check, 
  RotateCcw, 
  Save 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateAssistantName, updateSystemPersona, toggleMemory, resetSettings } = useSettings();
  const { user, updateProfile } = useAuth();
  
  const [userName, setUserName] = useState(user?.name || '');
  const userAvatar = user?.avatarUrl || '';
  const [companionName, setCompanionName] = useState(settings.assistantName);
  const [personaPrompt, setPersonaPrompt] = useState(settings.systemPersona);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [companionSuccess, setCompanionSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    if (!userName.trim()) return;

    updateProfile(userName.trim(), userAvatar);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleCompanionSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanionSuccess(false);
    if (!companionName.trim() || !personaPrompt.trim()) return;

    updateAssistantName(companionName.trim());
    updateSystemPersona(personaPrompt.trim());
    setCompanionSuccess(true);
    setTimeout(() => setCompanionSuccess(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setCompanionName('Saarthi AI');
    setPersonaPrompt('You are Saarthi AI, a highly intuitive and powerful agentic companion. Act as a practical digital helper, prioritizing logic, deep understanding, clear explanations, and clean code output. Address the user with respect, use formatting where useful, and remember context across exchanges.');
    
    // Trigger quick success indicator
    setCompanionSuccess(true);
    setTimeout(() => setCompanionSuccess(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      {/* Main Settings Console Workspace */}
      <div className="flex-1 pl-64 min-h-screen flex flex-col animated-bg dot-grid bg-slate-950">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">Companion Settings Console</span>
          </div>
          <div className="text-[10px] bg-slate-900 border border-white/10 px-3 py-1 rounded-lg text-slate-400 font-semibold tracking-wider uppercase">
            Memory Engine: {settings.memoryEnabled ? 'ONLINE' : 'STANDBY'}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-8 max-w-4xl mx-auto w-full space-y-8">
          
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Cognitive Control Room</h2>
            <p className="text-slate-400 text-xs mt-1 font-medium">Tweak companion system personas, personalize owner parameters, and toggle semantic memory buffers.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            
            {/* Memory Engine Configuration Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-sm mb-1 flex items-center space-x-2">
                    <Database className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Manas Memory Engine</span>
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                    When active, the memory layer monitors conversation sequences to extract relevant personal preferences and project configurations. It persists facts across multiple sessions.
                  </p>
                </div>

                {/* Glowing Toggle Button */}
                <button
                  type="button"
                  onClick={toggleMemory}
                  className={`w-14 h-7.5 rounded-full p-1.5 transition-colors duration-300 relative ${
                    settings.memoryEnabled ? 'bg-cyan-500 glow-cyan' : 'bg-slate-800 border border-white/5'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-300 transform ${
                    settings.memoryEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center space-x-2 text-[10px] text-slate-500 font-semibold uppercase">
                <span>Current Status:</span>
                <span className={settings.memoryEnabled ? 'text-emerald-400' : 'text-amber-500'}>
                  {settings.memoryEnabled ? 'ONLINE - Active Fact-Digestion Enabled' : 'OFFLINE - Volatile Conversations Only'}
                </span>
              </div>
            </div>

            {/* Companion Identity Form */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold text-sm mb-1 flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
                <span>Companion Customization</span>
              </h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Tweak the visible name and customize the core AI system instructions which govern the companion's tone, syntax patterns, and personality rules.
              </p>

              <form onSubmit={handleCompanionSave} className="space-y-5">
                <div>
                  <label htmlFor="companionName" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Assistant Name
                  </label>
                  <input
                    id="companionName"
                    type="text"
                    required
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="personaPrompt" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    System Persona Instructions
                  </label>
                  <textarea
                    id="personaPrompt"
                    rows={4}
                    required
                    value={personaPrompt}
                    onChange={(e) => setPersonaPrompt(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono leading-relaxed"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all glow-cyan hover:scale-[1.01]"
                  >
                    {companionSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Saved Config!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Customization Form */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold text-sm mb-1 flex items-center space-x-2">
                <UserIcon className="w-4.5 h-4.5 text-cyan-400" />
                <span>Owner Customization</span>
              </h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Configure your public nickname that Saarthi AI addresses you by inside dashboard interfaces and chat summaries.
              </p>

              <form onSubmit={handleProfileSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-2">
                    <label htmlFor="userName" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      User Nickname
                    </label>
                    <input
                      id="userName"
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs px-5 py-2.5 h-[38px] rounded-xl transition-all glow-cyan hover:scale-[1.01]"
                    >
                      {profileSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved Profile!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
export default Settings;
