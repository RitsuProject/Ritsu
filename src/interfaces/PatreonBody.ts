/* eslint-disable camelcase */

interface PatreonUser {
  attributes: {
    discord_id?: string
  }
}

interface PatreonData {
  attributes: {
    last_charge_status: string
  }
}

export default interface PatreonBody {
  included: PatreonUser[]
  data: PatreonData
}
