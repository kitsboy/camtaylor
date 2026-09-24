import React from 'react';
import { formatAltitude, getWaypoint } from '../data/waypoints';

/**
 * Trail signage between homepage sections. Every section is a waypoint on one
 * route, so the band tells you where you are and what the conditions are
 * before you read it.
 */
export const WaypointBand: React.FC<{ id: string }> = ({ id }) => {
  const waypoint = getWaypoint(id);
  if (!waypoint) return null;

  return (
    <div className="waypoint-band" data-waypoint={waypoint.id}>
      <span className="waypoint-tick" aria-hidden="true" />
      <div className="waypoint-copy">
        <span className="waypoint-camp">{waypoint.camp}</span>
        <span className="waypoint-altitude">{formatAltitude(waypoint.altitude)}</span>
        <span className={`waypoint-condition waypoint-condition--${waypoint.condition.toLowerCase()}`}>
          {waypoint.condition}
        </span>
      </div>
      <span className="waypoint-rule" aria-hidden="true" />
      <p className="waypoint-blurb">{waypoint.blurb}</p>
    </div>
  );
};
