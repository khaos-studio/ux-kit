#!/bin/bash

# System Information Utilities
# Utility functions for system information gathering

set -euo pipefail

# Get system hostname
get_hostname() {
    local hostname=""
    
    if command -v hostname >/dev/null 2>&1; then
        hostname=$(hostname)
    elif [[ -f /proc/sys/kernel/hostname ]]; then
        hostname=$(cat /proc/sys/kernel/hostname)
    else
        hostname="unknown"
    fi
    
    echo "$hostname"
}

# Get system uptime
get_uptime() {
    local uptime=""
    
    if command -v uptime >/dev/null 2>&1; then
        uptime=$(uptime | awk '{print $3,$4}' | sed 's/,//')
    elif [[ -f /proc/uptime ]]; then
        local seconds=$(cat /proc/uptime | awk '{print int($1)}')
        local days=$((seconds / 86400))
        local hours=$(((seconds % 86400) / 3600))
        local minutes=$(((seconds % 3600) / 60))
        uptime="${days}d ${hours}h ${minutes}m"
    else
        uptime="unknown"
    fi
    
    echo "$uptime"
}

# Get system memory information
get_memory_info() {
    local total_memory=""
    local available_memory=""
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        total_memory=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024/1024) "GB"}')
        available_memory=$(vm_stat | grep "Pages free" | awk '{print int($3*4096/1024/1024/1024) "GB"}')
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if [[ -f /proc/meminfo ]]; then
            total_memory=$(grep "MemTotal" /proc/meminfo | awk '{print int($2/1024/1024) "GB"}')
            available_memory=$(grep "MemAvailable" /proc/meminfo | awk '{print int($2/1024/1024) "GB"}')
        else
            total_memory="unknown"
            available_memory="unknown"
        fi
    else
        total_memory="unknown"
        available_memory="unknown"
    fi
    
    echo "Total: $total_memory, Available: $available_memory"
}

# Get system CPU information
get_cpu_info() {
    local cpu_info=""
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        cpu_info=$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "unknown")
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if [[ -f /proc/cpuinfo ]]; then
            cpu_info=$(grep "model name" /proc/cpuinfo | head -1 | cut -d':' -f2 | sed 's/^[[:space:]]*//')
        else
            cpu_info="unknown"
        fi
    else
        cpu_info="unknown"
    fi
    
    echo "$cpu_info"
}

# Get system disk information
get_disk_info() {
    local disk_info=""
    
    if command -v df >/dev/null 2>&1; then
        disk_info=$(df -h / | tail -1 | awk '{print "Total: " $2 ", Used: " $3 ", Available: " $4 ", Usage: " $5}')
    else
        disk_info="unknown"
    fi
    
    echo "$disk_info"
}

# Get system network information
get_network_info() {
    local network_info=""
    
    if command -v ifconfig >/dev/null 2>&1; then
        network_info=$(ifconfig | grep -E "inet [0-9]" | head -1 | awk '{print $2}')
    elif command -v ip >/dev/null 2>&1; then
        network_info=$(ip route get 1 | awk '{print $7; exit}')
    else
        network_info="unknown"
    fi
    
    echo "$network_info"
}

# Get system timezone
get_timezone() {
    local timezone=""
    
    if command -v timedatectl >/dev/null 2>&1; then
        timezone=$(timedatectl | grep "Time zone" | awk '{print $3}')
    elif [[ -f /etc/timezone ]]; then
        timezone=$(cat /etc/timezone)
    elif command -v date >/dev/null 2>&1; then
        timezone=$(date +%Z)
    else
        timezone="unknown"
    fi
    
    echo "$timezone"
}

# Get system locale
get_locale() {
    local locale=""
    
    if [[ -n "${LANG:-}" ]]; then
        locale="$LANG"
    elif [[ -n "${LC_ALL:-}" ]]; then
        locale="$LC_ALL"
    else
        locale="unknown"
    fi
    
    echo "$locale"
}

# Get system shell
get_shell() {
    local shell=""
    
    if [[ -n "${SHELL:-}" ]]; then
        shell=$(basename "$SHELL")
    else
        shell="unknown"
    fi
    
    echo "$shell"
}

# Get system user information
get_user_info() {
    local user_info=""
    
    if [[ -n "${USER:-}" ]]; then
        user_info="$USER"
    elif command -v whoami >/dev/null 2>&1; then
        user_info=$(whoami)
    else
        user_info="unknown"
    fi
    
    echo "$user_info"
}

# Get comprehensive system information
get_detailed_system_info() {
    echo "=== Detailed System Information ==="
    echo "Hostname: $(get_hostname)"
    echo "Uptime: $(get_uptime)"
    echo "Memory: $(get_memory_info)"
    echo "CPU: $(get_cpu_info)"
    echo "Disk: $(get_disk_info)"
    echo "Network: $(get_network_info)"
    echo "Timezone: $(get_timezone)"
    echo "Locale: $(get_locale)"
    echo "Shell: $(get_shell)"
    echo "User: $(get_user_info)"
}

# Export functions for use by other scripts
export -f get_hostname
export -f get_uptime
export -f get_memory_info
export -f get_cpu_info
export -f get_disk_info
export -f get_network_info
export -f get_timezone
export -f get_locale
export -f get_shell
export -f get_user_info
export -f get_detailed_system_info

# Run detailed system info if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    get_detailed_system_info
fi
