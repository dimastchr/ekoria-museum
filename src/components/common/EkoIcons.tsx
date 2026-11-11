import React from 'react';

// ============================================================================
// 1. EKO HEART (3D Glossy Beveled Heart for Student HUD Lives)
// ============================================================================
export const EkoHeart: React.FC<{ filled: boolean; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  filled,
  size = 'md',
  className = ''
}) => {
  const dim = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-200 ${filled ? 'scale-100 drop-shadow-sm' : 'scale-90 opacity-40'} ${className}`}
    >
      <defs>
        <linearGradient id={`heartGrad_${filled ? 'on' : 'off'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {filled ? (
            <>
              <stop offset="0%" stopColor="#FF4D6D" />
              <stop offset="50%" stopColor="#E60039" />
              <stop offset="100%" stopColor="#A60024" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </>
          )}
        </linearGradient>
        <radialGradient id="heartSpecular" cx="30%" cy="25%" r="35%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Heart Base with 3D gradient */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={`url(#heartGrad_${filled ? 'on' : 'off'})`}
      />
      {/* 3D Glossy Reflection on top lobe */}
      {filled && (
        <path
          d="M7.5 4.5C5.57 4.5 4 6.07 4 8c0 1.5 1.1 3.2 2.7 4.7 1.2-1.8 3.3-3.2 5.3-4.2C11 6.2 9.5 4.5 7.5 4.5z"
          fill="url(#heartSpecular)"
        />
      )}
    </svg>
  );
};

// ============================================================================
// 2. EKO ZONE ICONS (3D Cartoon Sphere Badges for 8 Zones)
// ============================================================================
export type EkoZoneKey =
  | 'hutan'
  | 'padang-rumput'
  | 'sungai-danau'
  | 'laut'
  | 'rantai-makanan'
  | 'keseimbangan-ekosistem'
  | 'ekosistem-buatan'
  | 'pelestarian-lingkungan'
  // Legacy aliases
  | 'hutan-harmoni'
  | 'sungai-bersih'
  | 'laut-karang'
  | 'sawah-kebun';

export const EkoZoneIcon: React.FC<{ zoneId: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  zoneId,
  size = 'md',
  className = ''
}) => {
  const dim = size === 'xs' ? 20 : size === 'sm' ? 28 : size === 'md' ? 42 : size === 'lg' ? 60 : 80;

  // Normalize zone id
  let normalized: string = zoneId;
  if (normalized === 'hutan-harmoni') normalized = 'hutan';
  if (normalized === 'sungai-bersih') normalized = 'sungai-danau';
  if (normalized === 'laut-karang') normalized = 'laut';
  if (normalized === 'sawah-kebun') normalized = 'ekosistem-buatan';

  switch (normalized) {
    case 'hutan':
      // 3D Hyper-Realistic Lush Rainforest Orb
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="hutanSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="30%" stopColor="#22C55E" />
              <stop offset="70%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#0B381A" />
            </radialGradient>
            <linearGradient id="trunk3D" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <radialGradient id="sunBeam3D" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </radialGradient>
            <filter id="shadow3D" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#0B381A" floodOpacity="0.4" />
            </filter>
          </defs>
          {/* Base Volumetric Glass Orb */}
          <circle cx="32" cy="32" r="28" fill="url(#hutanSphere3D)" stroke="#BBF7D0" strokeWidth="1.8" filter="url(#shadow3D)" />
          
          {/* Sunbeam Cone Shaft */}
          <path d="M22 6L42 6L36 40L28 40Z" fill="url(#sunBeam3D)" />
          
          {/* Mossy Ground Base */}
          <ellipse cx="32" cy="50" rx="22" ry="7" fill="#14532D" />
          <ellipse cx="32" cy="49" rx="18" ry="5" fill="#16A34A" opacity="0.9" />

          {/* 3D Trunk */}
          <path d="M30 36C29 42 27 48 25 52H39C37 48 35 42 34 36Z" fill="url(#trunk3D)" />
          <path d="M25 52C27 50 30 49 32 49C34 49 37 50 39 52" stroke="#451A03" strokeWidth="1.5" />

          {/* Layered 3D Foliage Canopies */}
          <path d="M32 14C23 14 18 22 20 28C22 34 30 32 32 30C34 32 42 34 44 28C46 22 41 14 32 14Z" fill="#15803D" />
          <path d="M32 12C25 12 21 18 23 23C25 28 30 27 32 25C34 27 39 28 41 23C43 18 39 12 32 12Z" fill="#22C55E" />
          <path d="M32 10C27 10 24 14 25 18C27 22 30 21 32 19C34 21 37 22 39 18C40 14 37 10 32 10Z" fill="#4ADE80" />

          {/* Glowing spores / Butterflies */}
          <circle cx="21" cy="24" r="1.5" fill="#FEF08A" opacity="0.9" />
          <circle cx="43" cy="26" r="1.2" fill="#FEF08A" opacity="0.9" />
          <circle cx="37" cy="18" r="1.5" fill="#86EFAC" opacity="0.8" />

          {/* 3D Gloss Highlight Ring */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.5" transform="rotate(-30 22 16)" />
          <ellipse cx="44" cy="46" rx="6" ry="2" fill="#FFFFFF" opacity="0.2" transform="rotate(20 44 46)" />
        </svg>
      );

    case 'padang-rumput':
      // 3D Hyper-Realistic Golden Savanna Orb
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="savannaSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#EAB308" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </radialGradient>
            <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Glass Base */}
          <circle cx="32" cy="32" r="28" fill="url(#savannaSphere3D)" stroke="#FEF08A" strokeWidth="1.8" />

          {/* Sun Halo */}
          <circle cx="44" cy="20" r="9" fill="url(#sunHalo)" opacity="0.85" />

          {/* Rolling Golden Hills */}
          <path d="M4 42C14 38 24 45 36 40C48 35 56 42 60 44V60H4V42Z" fill="#A16207" opacity="0.8" />
          <path d="M4 46C18 42 30 48 44 44C52 42 58 46 60 48V60H4V46Z" fill="#CA8A04" />

          {/* 3D Acacia Tree */}
          <path d="M26 48V34M26 34L18 26M26 34L34 27M26 38L32 33" stroke="#542A06" strokeWidth="2.8" strokeLinecap="round" />
          {/* Flat Umbrella Canopy */}
          <ellipse cx="18" cy="24" rx="9" ry="3.5" fill="#15803D" />
          <ellipse cx="18" cy="23" rx="7" ry="2.5" fill="#22C55E" />
          <ellipse cx="32" cy="25" rx="11" ry="4" fill="#16A34A" />
          <ellipse cx="32" cy="24" rx="9" ry="3" fill="#4ADE80" />

          {/* Grazing Deer Silhouette */}
          <path d="M42 46C42 44 44 43 45 41C46 43 48 43 48 45V48H47V46H44V48H43V46H42Z" fill="#542A06" />

          {/* Grass Blades */}
          <path d="M10 52L12 44M14 52L17 45M20 52L21 46M50 52L52 45" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Gloss */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 22 16)" />
        </svg>
      );

    case 'sungai-danau':
      // 3D Crystal River Drop Orb
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="riverSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#A5F3FC" />
              <stop offset="35%" stopColor="#06B6D4" />
              <stop offset="70%" stopColor="#0891B2" />
              <stop offset="100%" stopColor="#0E4A5E" />
            </radialGradient>
            <radialGradient id="waterDropShine" cx="30%" cy="25%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          {/* Outer Glass Sphere */}
          <circle cx="32" cy="32" r="28" fill="url(#riverSphere3D)" stroke="#CFFAFE" strokeWidth="1.8" />

          {/* Winding 3D River Channel */}
          <path d="M8 20C18 20 20 32 32 32C44 32 46 48 56 48V60H8V20Z" fill="#0284C7" opacity="0.6" />
          <path d="M12 22C20 22 22 34 32 34C42 34 44 46 52 46" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M14 22C21 22 23 34 32 34C41 34 43 46 50 46" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" />

          {/* River Stones */}
          <ellipse cx="20" cy="42" rx="4" ry="2.5" fill="#64748B" />
          <ellipse cx="20" cy="41" rx="3" ry="1.8" fill="#94A3B8" />
          <ellipse cx="42" cy="28" rx="3.5" ry="2" fill="#475569" />

          {/* Central 3D Crystal Water Droplet */}
          <path
            d="M32 14C32 14 20 28 20 35C20 41.6 25.4 47 32 47C38.6 47 44 41.6 44 35C44 28 32 14 32 14Z"
            fill="url(#waterDropShine)"
            stroke="#E0F2FE"
            strokeWidth="1.5"
          />
          {/* Inner Droplet Reflection Curved Ribbon */}
          <path d="M26 33C26 29 29 22 29 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Floating Water Lily / Teratai Leaf */}
          <path d="M40 40C44 40 47 43 45 46C43 49 38 48 37 45C36 42 38 40 40 40Z" fill="#22C55E" />
          <circle cx="41" cy="43" r="1.5" fill="#F43F5E" />

          {/* Gloss Highlight */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 22 16)" />
        </svg>
      );

    case 'laut':
      // 3D Deep Ocean Coral & Sea Turtle Sphere
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="oceanSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="70%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#0C4A6E" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#oceanSphere3D)" stroke="#BAE6FD" strokeWidth="1.8" />

          {/* Sun Caustics from top */}
          <path d="M22 6L26 24M34 6L32 28M44 6L38 20" stroke="#E0F2FE" strokeWidth="1" opacity="0.4" strokeLinecap="round" />

          {/* Seabed Sandy Slope */}
          <path d="M4 52C16 48 32 54 60 50V60H4V52Z" fill="#FDE047" opacity="0.4" />

          {/* Vibrant 3D Red Coral Branches */}
          <path d="M20 54V38M20 38C20 33 15 31 15 26M20 38C20 33 25 31 25 27" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M20 38C20 33 15 31 15 26M20 38C20 33 25 31 25 27" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />

          {/* Purple Coral */}
          <path d="M42 54V40M42 40C42 36 38 34 38 30M42 40C42 36 46 34 46 31" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />

          {/* Swimming Sea Turtle Silhouette */}
          <path d="M30 22C34 20 40 22 41 26C38 28 32 28 29 26Z" fill="#34D399" />
          <circle cx="42" cy="24" r="2" fill="#34D399" />
          <path d="M35 21L37 16M33 27L35 31" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />

          {/* Rising Bubbles */}
          <circle cx="28" cy="18" r="2.5" fill="#E0F2FE" opacity="0.8" />
          <circle cx="30" cy="12" r="1.5" fill="#E0F2FE" opacity="0.9" />
          <circle cx="23" cy="24" r="1.8" fill="#E0F2FE" opacity="0.7" />

          {/* Gloss Highlight */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 22 16)" />
        </svg>
      );

    case 'rantai-makanan':
      // 3D Energy Chain & Sun Flow Orb
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="chainSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
            <linearGradient id="goldChainGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F5C518" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#chainSphere3D)" stroke="#FEF08A" strokeWidth="1.8" />

          {/* Radiant Sun Core in Center */}
          <circle cx="32" cy="32" r="8" fill="#FEF08A" />
          <circle cx="32" cy="32" r="5" fill="#FFFFFF" />

          {/* Interlocking 3D Metallic Chain Rings */}
          <ellipse cx="23" cy="32" rx="9" ry="13" stroke="url(#goldChainGrad)" strokeWidth="4.5" transform="rotate(-35 23 32)" />
          <ellipse cx="41" cy="32" rx="9" ry="13" stroke="#0F3D2E" strokeWidth="4.5" transform="rotate(35 41 32)" />
          <ellipse cx="41" cy="32" rx="9" ry="13" stroke="url(#goldChainGrad)" strokeWidth="2" transform="rotate(35 41 32)" />

          {/* Energy Flow Arrows */}
          <path d="M26 18L36 18M36 18L32 14M36 18L32 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 46L28 46M28 46L32 42M28 46L32 50" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Green Producer Leaf badge overlay */}
          <circle cx="16" cy="44" r="5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M14 45C16 42 18 43 18 43" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

          {/* Gloss Highlight */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 22 16)" />
        </svg>
      );

    case 'keseimbangan-ekosistem':
      // 3D Harmonic Scales of Nature
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="balanceSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="35%" stopColor="#10B981" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022C22" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#balanceSphere3D)" stroke="#A7F3D0" strokeWidth="1.8" />

          {/* Glowing Infinity Energy Loop Background */}
          <path
            d="M20 32C20 26 26 26 32 32C38 38 44 38 44 32C44 26 38 26 32 32C26 38 20 38 20 32Z"
            stroke="#A7F3D0"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Golden Balance Scale Structure */}
          <path d="M32 16V46M18 22H46M26 46H38" stroke="#F5C518" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="16" r="3" fill="#FEF08A" />

          {/* Left Pan: Green Living Leaf */}
          <path d="M18 22L13 33H23L18 22Z" fill="#34D399" />
          <path d="M18 28C16 26 14 28 14 30C14 32 18 32 18 30" fill="#22C55E" />

          {/* Right Pan: Crystal Water Drop */}
          <path d="M46 22L41 33H51L46 22Z" fill="#38BDF8" />
          <path d="M46 25C46 25 43 29 43 31C43 33 44.5 34 46 34C47.5 34 49 33 49 31C49 29 46 25 46 25Z" fill="#E0F2FE" />

          {/* Gloss Highlight */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.5" transform="rotate(-30 22 16)" />
        </svg>
      );

    case 'ekosistem-buatan':
      // 3D Rice Terraces & Cottage Agricultural Sphere
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="farmSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#BEF264" />
              <stop offset="35%" stopColor="#84CC16" />
              <stop offset="70%" stopColor="#4D7C0F" />
              <stop offset="100%" stopColor="#1A2E05" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#farmSphere3D)" stroke="#ECFCCB" strokeWidth="1.8" />

          {/* Golden Sun */}
          <circle cx="46" cy="18" r="6" fill="#FDE047" />

          {/* Terraced Rice Paddy Field Steps */}
          <path d="M6 38C18 34 32 40 58 36V60H6V38Z" fill="#65A30D" />
          <path d="M6 44C20 40 36 46 58 42V60H6V44Z" fill="#84CC16" />
          <path d="M6 50C22 46 38 52 58 48V60H6V50Z" fill="#A3E635" />

          {/* Farmer Cottage */}
          <path d="M22 28L32 20L42 28H22Z" fill="#EA580C" />
          <rect x="24" y="28" width="16" height="11" fill="#FEF08A" />
          <rect x="30" y="32" width="4" height="7" fill="#78350F" />

          {/* Golden Rice Stalks */}
          <path d="M12 48C14 42 16 42 16 40M16 48C18 42 20 42 20 40" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />

          {/* Gloss Highlight */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 22 16)" />
        </svg>
      );

    case 'pelestarian-lingkungan':
    default:
      // 3D Cupped Hands & Sprout Eco Globe
      return (
        <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
          <defs>
            <radialGradient id="protectSphere3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="35%" stopColor="#22C55E" />
              <stop offset="70%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#062E14" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#protectSphere3D)" stroke="#DCFCE7" strokeWidth="1.8" />

          {/* Earth Sprout Stem */}
          <path d="M32 44V26" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />

          {/* Left Leaf */}
          <path d="M32 32C24 28 18 31 16 35C16 40 24 40 32 35" fill="#4ADE80" stroke="#15803D" strokeWidth="1" />

          {/* Right Leaf */}
          <path d="M32 26C40 22 46 25 48 29C48 34 40 34 32 29" fill="#86EFAC" stroke="#15803D" strokeWidth="1" />

          {/* Top Crystal Dew Drop */}
          <circle cx="32" cy="20" r="3" fill="#E0F2FE" />
          <circle cx="31" cy="19" r="1" fill="#FFFFFF" />

          {/* Protective Cupped Hands Arc */}
          <path d="M16 42C22 49 42 49 48 42" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M20 45C25 50 39 50 44 45" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Gloss Highlight */}
          <ellipse cx="22" cy="16" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 22 16)" />
        </svg>
      );
  }
};

// ============================================================================
// 3. EKO BIOTA ICON (Unified 3D Badges for Organisms & Abiotic Factors)
// ============================================================================
export const EkoBiotaIcon: React.FC<{
  id: string;
  name?: string;
  role?: string;
  category?: 'flora' | 'fauna' | 'fungi' | 'mikroba' | 'abiotik' | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ id, name = '', role = '', category = 'fauna', size = 'md', className = '' }) => {
  const dim = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64;
  const iconId = (id || name).toLowerCase();

  // Color schemes by role & category
  let bgGradient = 'from-emerald-500 to-green-800';
  let borderColor = '#86EFAC';
  let badgeType: 'flora' | 'deer' | 'tiger' | 'mushroom' | 'snake' | 'bird' | 'fish' | 'insect' | 'sun' | 'water' | 'soil' | 'turtle' | 'generic' = 'generic';

  if (category === 'flora' || iconId.includes('pohon') || iconId.includes('bunga') || iconId.includes('rumput') || iconId.includes('padi') || iconId.includes('jagung') || iconId.includes('teratai') || iconId.includes('ganggang')) {
    bgGradient = 'from-emerald-400 to-emerald-700';
    borderColor = '#A7F3D0';
    badgeType = 'flora';
  } else if (category === 'fungi' || iconId.includes('jamur') || iconId.includes('cacing')) {
    bgGradient = 'from-amber-600 to-amber-900';
    borderColor = '#FDE68A';
    badgeType = 'mushroom';
  } else if (category === 'abiotik' || iconId.includes('matahari') || iconId.includes('cahaya')) {
    bgGradient = 'from-yellow-400 to-amber-600';
    borderColor = '#FEF08A';
    badgeType = 'sun';
  } else if (category === 'abiotik' || iconId.includes('air') || iconId.includes('sungai') || iconId.includes('laut') || iconId.includes('gelombang')) {
    bgGradient = 'from-cyan-400 to-blue-700';
    borderColor = '#BAE6FD';
    badgeType = 'water';
  } else if (category === 'abiotik' || iconId.includes('tanah') || iconId.includes('batu') || iconId.includes('pasir')) {
    bgGradient = 'from-amber-700 to-stone-800';
    borderColor = '#D6D3D1';
    badgeType = 'soil';
  } else if (iconId.includes('rusa') || iconId.includes('kelinci') || iconId.includes('sapi') || iconId.includes('banteng')) {
    bgGradient = 'from-amber-500 to-amber-800';
    borderColor = '#FDE68A';
    badgeType = 'deer';
  } else if (iconId.includes('harimau') || iconId.includes('macan') || iconId.includes('kucing')) {
    bgGradient = 'from-orange-500 to-red-800';
    borderColor = '#FED7AA';
    badgeType = 'tiger';
  } else if (iconId.includes('ular')) {
    bgGradient = 'from-lime-600 to-emerald-900';
    borderColor = '#D9F99D';
    badgeType = 'snake';
  } else if (iconId.includes('elang') || iconId.includes('burung') || iconId.includes('hantu') || iconId.includes('rangkong')) {
    bgGradient = 'from-amber-600 to-stone-900';
    borderColor = '#FED7AA';
    badgeType = 'bird';
  } else if (iconId.includes('ikan') || iconId.includes('hiu') || iconId.includes('lele') || iconId.includes('wader')) {
    bgGradient = 'from-sky-400 to-cyan-800';
    borderColor = '#BAE6FD';
    badgeType = 'fish';
  } else if (iconId.includes('penyu') || iconId.includes('kura')) {
    bgGradient = 'from-teal-500 to-emerald-800';
    borderColor = '#99F6E4';
    badgeType = 'turtle';
  } else if (iconId.includes('belalang') || iconId.includes('capung') || iconId.includes('kepik') || iconId.includes('kupu')) {
    bgGradient = 'from-lime-500 to-green-700';
    borderColor = '#BEF264';
    badgeType = 'insect';
  }

  return (
    <div
      style={{ width: dim, height: dim }}
      className={`rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-md relative overflow-hidden border-2 ${className}`}
      style-border={borderColor}
    >
      {/* 3D Gloss reflection on top */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-full" />
      
      {/* Specific 3D Illustrated Icon Graphic */}
      {badgeType === 'flora' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M12 22V11" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 11C8 9 5 12 5 15C5 18 9 19 12 16" fill="#86EFAC" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M12 7C16 5 19 8 19 11C19 14 15 15 12 12" fill="#FEF08A" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="12" cy="7" r="2.5" fill="#FDE047" />
        </svg>
      )}

      {badgeType === 'mushroom' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M12 21V13" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M4 13C4 7 7 4 12 4C17 4 20 7 20 13H4Z" fill="#F87171" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="8" cy="9" r="1.5" fill="#FFFFFF" />
          <circle cx="15" cy="8" r="1.2" fill="#FFFFFF" />
          <circle cx="12" cy="11" r="1.2" fill="#FFFFFF" />
        </svg>
      )}

      {badgeType === 'deer' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          {/* Antlers */}
          <path d="M7 4L9 8M17 4L15 8M5 6L8 8M19 6L16 8" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Head & Ears */}
          <path d="M9 9C9 9 7 9 6 12C5 14 7 15 9 14L10 18H14L15 14C17 15 19 14 18 12C17 9 15 9 15 9H9Z" fill="#FFFFFF" />
          <circle cx="10" cy="12" r="1" fill="#78350F" />
          <circle cx="14" cy="12" r="1" fill="#78350F" />
          <ellipse cx="12" cy="16" rx="1.5" ry="1" fill="#78350F" />
        </svg>
      )}

      {badgeType === 'tiger' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          {/* Ears */}
          <path d="M6 7L8 10M18 7L16 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Tiger face */}
          <circle cx="12" cy="13" r="7" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Stripes */}
          <path d="M12 6V9M8 11L10 12M16 11L14 12" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9.5" cy="13" r="1" fill="#1E293B" />
          <circle cx="14.5" cy="13" r="1" fill="#1E293B" />
          <path d="M11 16L12 17L13 16" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {badgeType === 'snake' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M17 6C15 6 14 7 13 9C12 11 10 12 8 13C6 14 5 16 6 18C7 20 10 20 12 19C14 18 15 16 17 15C19 14 20 12 19 10C19 7 18 6 17 6Z" stroke="#FFFFFF" strokeWidth="2.5" fill="#84CC16" />
          <circle cx="17" cy="8" r="1" fill="#14532D" />
          <path d="M19 7L21 6" stroke="#EF4444" strokeWidth="1.5" />
        </svg>
      )}

      {badgeType === 'bird' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M3 11C7 9 10 6 12 3C14 6 17 9 21 11C16 11 13 14 12 19C11 14 8 11 3 11Z" fill="#FFFFFF" />
          <path d="M12 8L15 11L12 14L9 11Z" fill="#F59E0B" />
        </svg>
      )}

      {badgeType === 'fish' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M20 12C16 7 9 8 5 12C9 16 16 17 20 12Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" />
          <path d="M4 12L2 9V15L4 12Z" fill="#FFFFFF" />
          <circle cx="16" cy="11" r="1" fill="#0284C7" />
          <path d="M10 11C11 12 11 13 10 14" stroke="#0284C7" strokeWidth="1" strokeLinecap="round" />
        </svg>
      )}

      {badgeType === 'turtle' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="13" rx="6" ry="5" fill="#34D399" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="12" cy="6" r="2.5" fill="#10B981" />
          <path d="M7 10L5 8M17 10L19 8M7 16L5 18M17 16L19 18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {badgeType === 'insect' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="13" rx="3.5" ry="5.5" fill="#A3E635" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="12" cy="6" r="2" fill="#FFFFFF" />
          <path d="M11 4L9 2M13 4L15 2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 11L5 10M16 11L19 10M8 14L5 15M16 14L19 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {badgeType === 'sun' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#FEF08A" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M12 2V4M12 20V22M2 12H4M20 12H22M5 5L6.5 6.5M17.5 17.5L19 19M5 19L6.5 17.5M17.5 6.5L19 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {badgeType === 'water' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M12 3C12 3 6 11 6 15.5C6 18.8 8.7 21.5 12 21.5C15.3 21.5 18 18.8 18 15.5C18 11 12 3 12 3Z" fill="#E0F2FE" />
          <path d="M9 14.5C9 12 11 8.5 11 8.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {badgeType === 'soil' && (
        <svg width={dim * 0.65} height={dim * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M4 17C7 15 11 15 14 17C17 19 20 18 21 17" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="8" cy="11" r="2" fill="#E7E5E4" />
          <circle cx="15" cy="9" r="3" fill="#D6D3D1" />
          <circle cx="18" cy="13" r="1.5" fill="#E7E5E4" />
        </svg>
      )}

      {badgeType === 'generic' && (
        <svg width={dim * 0.6} height={dim * 0.6} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" fill="#FFFFFF" />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// 4. EKO BADGE MEDAL ICON (For Achievements & Certificates)
// ============================================================================
export const EkoBadgeIcon: React.FC<{ badgeId: string; isEarned: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  badgeId,
  isEarned,
  size = 'md'
}) => {
  const dim = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;

  if (!isEarned) {
    return (
      <div
        style={{ width: dim, height: dim }}
        className="rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-slate-300 flex items-center justify-center shadow-inner relative"
      >
        <svg width={dim * 0.45} height={dim * 0.45} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" fill="#64748B" />
          <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.5" fill="#E2E8F0" />
        </svg>
      </div>
    );
  }

  // Earned 3D Metallic Badge
  return (
    <div
      style={{ width: dim, height: dim }}
      className="rounded-2xl bg-gradient-to-br from-amber-300 via-[#F5C518] to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
      <svg width={dim * 0.6} height={dim * 0.6} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#0F3D2E" stroke="#FEF08A" strokeWidth="1.5" />
        <path d="M12 6L13.8 9.6L17.8 10.2L14.9 13L15.6 17L12 15.1L8.4 17L9.1 13L6.2 10.2L10.2 9.6L12 6Z" fill="#F5C518" />
      </svg>
    </div>
  );
};

// ============================================================================
// 5. EKO WASTE SORTING ICONS (For Zone 8 Trash Sorting Activity)
// ============================================================================
export const EkoWasteIcon: React.FC<{ wasteId: string; size?: 'sm' | 'md' | 'lg' }> = ({ wasteId, size = 'md' }) => {
  const dim = size === 'sm' ? 36 : size === 'lg' ? 68 : 52;
  const id = wasteId.toLowerCase();

  return (
    <div
      style={{ width: dim, height: dim }}
      className="rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DEC9] shadow-md flex items-center justify-center p-2"
    >
      {/* 1. Kulit Pisang (Organik) */}
      {(id.includes('pisang') || id === 'w1') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <path d="M6 22C10 26 22 25 26 10C24 14 18 19 12 18" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" />
          <path d="M26 10C24 13 18 15 15 25" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
          <circle cx="26" cy="10" r="1.5" fill="#713F12" />
        </svg>
      )}

      {/* 2. Botol Plastik (Anorganik) */}
      {(id.includes('botol') || id === 'w2') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <rect x="13" y="4" width="6" height="3" rx="1" fill="#0284C7" />
          <path d="M11 9C11 7.5 13 7 16 7C19 7 21 7.5 21 9V26C21 27.5 19 28 16 28C13 28 11 27.5 11 26V9Z" fill="#38BDF8" opacity="0.8" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="11" y="14" width="10" height="5" fill="#0284C7" opacity="0.6" />
        </svg>
      )}

      {/* 3. Baterai (B3) */}
      {(id.includes('baterai') || id === 'w3') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <rect x="14" y="4" width="4" height="2" fill="#64748B" />
          <rect x="10" y="6" width="12" height="22" rx="2" fill="#E11D48" stroke="#BE123C" strokeWidth="1.5" />
          <path d="M16 11L13 17H19L16 23" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* 4. Daun Kering (Organik) */}
      {(id.includes('daun') || id === 'w4') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <path d="M6 26C10 24 16 18 26 6C26 16 20 22 6 26Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <path d="M6 26L22 10" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {/* 5. Kaleng Minuman (Anorganik) */}
      {(id.includes('kaleng') || id === 'w5') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="7" rx="7" ry="2.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <rect x="9" y="7" width="14" height="18" fill="#F59E0B" stroke="#64748B" strokeWidth="1.5" />
          <ellipse cx="16" cy="25" rx="7" ry="2.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      )}

      {/* 6. Lampu Neon / Bohlam (B3) */}
      {(id.includes('lampu') || id.includes('bohlam') || id === 'w6') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="13" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          <rect x="13" y="20" width="6" height="5" fill="#64748B" />
          <path d="M14 25H18" stroke="#334155" strokeWidth="2" />
          <path d="M16 10V14M14 12H18" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {/* 7. Sisa Sayur Kangkung (Organik) */}
      {(id.includes('sayur') || id === 'w7') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <path d="M12 26V14M16 26V8M20 26V16" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="16" cy="8" rx="4" ry="2" fill="#4ADE80" />
          <ellipse cx="12" cy="14" rx="3" ry="1.5" fill="#22C55E" />
          <ellipse cx="20" cy="16" rx="3" ry="1.5" fill="#22C55E" />
        </svg>
      )}

      {/* 8. Kantong Plastik (Anorganik) */}
      {(id.includes('kresek') || id.includes('plastik') || id === 'w8') && (
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <path d="M9 12V6H13V12M19 12V6H23V12M8 12H24L22 26H10L8 12Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// 6. EKO TREE STAGE ICON (Seed -> Sprout -> Sapling -> Mature Forest Tree)
// ============================================================================
export const EkoTreeStageIcon: React.FC<{ stage: number; size?: number }> = ({ stage, size = 96 }) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      {stage === 0 && (
        // Seed in rich earth
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="46" rx="22" ry="7" fill="#78350F" opacity="0.6" />
          {/* Acorn / Seed */}
          <path d="M32 24C24 24 20 32 24 40C28 48 36 48 40 40C44 32 40 24 32 24Z" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <path d="M25 24C28 20 36 20 39 24" fill="#92400E" stroke="#78350F" strokeWidth="2" />
          {/* Little root sprout */}
          <path d="M32 44C34 50 38 52 42 53" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {stage === 1 && (
        // Young Sprout
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="50" rx="20" ry="6" fill="#78350F" opacity="0.6" />
          <path d="M32 50V30" stroke="#65A30D" strokeWidth="4" strokeLinecap="round" />
          {/* Two green leaves */}
          <path d="M32 34C24 30 20 34 18 38C18 43 25 43 32 38" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.5" />
          <path d="M32 30C40 26 44 30 46 34C46 39 39 39 32 34" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
        </svg>
      )}

      {stage === 2 && (
        // Thriving Sapling
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="52" rx="22" ry="6" fill="#78350F" opacity="0.6" />
          <path d="M32 52V26" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          <path d="M32 36L22 30M32 32L42 26" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="28" r="9" fill="#22C55E" />
          <circle cx="44" cy="24" r="9" fill="#16A34A" />
          <circle cx="32" cy="18" r="12" fill="#4ADE80" />
        </svg>
      )}

      {stage === 3 && (
        // Magnificent Giant Rainforest Tree
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="54" rx="26" ry="6" fill="#78350F" opacity="0.6" />
          {/* Thick sturdy trunk */}
          <path d="M26 54L30 36H34L38 54Z" fill="#78350F" />
          {/* Broad layered canopy */}
          <circle cx="22" cy="32" r="14" fill="#15803D" />
          <circle cx="42" cy="32" r="14" fill="#16A34A" />
          <circle cx="32" cy="22" r="18" fill="#22C55E" />
          <circle cx="32" cy="20" r="14" fill="#4ADE80" opacity="0.7" />
          {/* Golden sun apples/flowers */}
          <circle cx="26" cy="22" r="2.5" fill="#FDE047" />
          <circle cx="38" cy="26" r="2.5" fill="#FDE047" />
          <circle cx="32" cy="32" r="2.5" fill="#FDE047" />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// 7. EKO LOGO ICON (3D Leaf with Science Globe Core)
// ============================================================================
export const EkoLogoIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
      <defs>
        <radialGradient id="ekoLogoSphere" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="60%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#0B4620" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#ekoLogoSphere)" stroke="#86EFAC" strokeWidth="1.5" />
      {/* 3D Leaf Curve */}
      <path
        d="M10 26C10 26 13 14 26 10C26 10 25 22 14 26C12 26.7 10 26 10 26Z"
        fill="#FEF08A"
      />
      <path d="M10 26C14 22 18 18 26 10" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gloss */}
      <ellipse cx="13" cy="10" rx="5" ry="2.5" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 13 10)" />
    </svg>
  );
};
