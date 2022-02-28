const talkgroupMap = (tgIds, defTg, userId) =>
  tgIds.reduce((acc, tgId, index) => {
    if (index === tgIds.length - 1)
      return `${acc} (${userId}, ${tgId}, ${tgId === defTg ? 1 : 0});`;
    return `${acc} (${userId}, ${tgId}, ${tgId === defTg ? 1 : 0}),`;
  }, `INSERT INTO user_talkgroup_maps (user_id, talkgroup_id, default_tg) VALUES`);

const controlStationMap = (csIds, userId) =>
  csIds.reduce((acc, csId, index) => {
    if (index === csIds.length - 1) return `${acc} (${userId}, ${csId});`;
    return `${acc} (${userId}, ${csId}),`;
  }, `INSERT INTO dispatcher_control_maps (dispatcher_id, control_id) VALUES`);

module.exports = { talkgroupMap, controlStationMap };
