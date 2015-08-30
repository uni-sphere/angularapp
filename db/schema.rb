# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150829081216) do

  create_table "actions", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "object_id"
    t.integer  "organization_id"
    t.boolean  "error",           default: false
    t.string   "user"
    t.string   "object"
    t.string   "type"
    t.string   "object_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "awsdocuments", force: :cascade do |t|
    t.string   "content"
    t.string   "title"
    t.text     "url"
    t.integer  "user_id"
    t.integer  "chapter_id"
    t.integer  "organization_id"
    t.boolean  "archived",        default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "chapters", force: :cascade do |t|
    t.string   "title"
    t.integer  "node_id"
    t.integer  "user_id"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "archived",   default: false
  end

  create_table "connexions", force: :cascade do |t|
    t.integer  "organization_id"
    t.string   "place"
    t.string   "ip"
    t.integer  "count",           default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "nodes", force: :cascade do |t|
    t.string   "name"
    t.integer  "parent_id"
    t.integer  "organization_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "archived",        default: false
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "subdomain"
    t.string   "latitude"
    t.string   "longitude"
    t.string   "place_id"
    t.string   "website"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "organizationsuserslinks", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "organization_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "reports", force: :cascade do |t|
    t.integer  "downloads",  default: 0
    t.integer  "node_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

# Could not dump table "users" because of following NoMethodError
#   undefined method `[]' for nil:NilClass

end
