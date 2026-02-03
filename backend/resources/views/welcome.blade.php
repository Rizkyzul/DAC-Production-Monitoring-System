<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="{{ asset('dac.svg') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DAC System Health</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes pulse-soft {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .status-pulse {
            animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        body {
            background-color: #0f172a;
            background-image: radial-gradient(circle at top right, #1e293b, #0f172a);
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen text-slate-200">

    <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div class="relative px-8 py-10 bg-slate-900 border border-slate-800 rounded-2xl leading-none flex flex-col w-[450px]">
            <div class="flex items-center justify-between mb-8">
                <div class="space-y-2">
                    <h2 class="text-xl font-bold tracking-wider text-white">DAC PRODUCTION</h2>
                    <p class="text-slate-500 text-xs font-mono uppercase tracking-widest">Monitoring System v1.0</p>
                </div>
                <div class="h-12 w-12 bg-orange-600/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                    <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
            </div>

            <div class="space-y-6">
                <div class="flex items-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                    <div class="relative flex h-3 w-3 mr-4">
                        <span class="status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-semibold text-emerald-400">API SERVICE ONLINE</span>
                        <span class="text-[10px] text-slate-500 font-mono">End-point: {{ url('/api') }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2">
                    <div class="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <p class="text-[10px] text-slate-500 uppercase">Environment</p>
                        <p class="text-sm font-mono text-slate-300">{{ app()->environment() }}</p>
                    </div>
                    <div class="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <p class="text-[10px] text-slate-500 uppercase">Framework</p>
                        <p class="text-sm font-mono text-slate-300">Laravel {{ app()->version() }}</p>
                    </div>
                </div>

                <p class="text-xs text-slate-500 text-center italic mt-4">
                    "Backend is ready. Waiting for client requests..."
                </p>
            </div>

            <a href="https://laravel.com/docs" target="_blank" class="mt-8 text-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest border-t border-slate-800 pt-6">
                Read API Documentation &rarr;
            </a>
        </div>
    </div>

</body>
</html>