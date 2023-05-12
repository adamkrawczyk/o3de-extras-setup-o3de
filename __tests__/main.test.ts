import * as core from "@actions/core";

import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

import * as linux from "../src/setup-linux";
import * as osx from "../src/setup-osx";
import * as windows from "../src/setup-windows";

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

describe("basic workflow tests", () => {
	beforeAll(() => {
		jest.spyOn(actions_exec, "exec").mockImplementation(jest.fn());
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it("run Linux workflow", async () => {
		await expect(linux.runLinux()).resolves.not.toThrow();
	});

	it("run Windows workflow", async () => {
		await expect(windows.runWindows()).resolves.not.toThrow();
	});

	it("run macOS workflow", async () => {
		await expect(osx.runOsX()).resolves.not.toThrow();
	});
});

describe("required-ros-distributions/melodic workflow tests", () => {
	beforeAll(() => {
		jest.spyOn(actions_exec, "exec").mockImplementation(jest.fn());
		jest.spyOn(core, "getInput").mockReturnValue("melodic");
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it("run Linux workflow", async () => {
		await expect(linux.runLinux()).resolves.not.toThrow();
	});

	it("run Windows workflow", async () => {
		await expect(windows.runWindows()).resolves.not.toThrow();
	});

	it("run macOS workflow", async () => {
		await expect(osx.runOsX()).resolves.not.toThrow();
	});
});

describe("validate distribution test", () => {
	it("test valid", async () => {
		await expect(utils.validateDistro(["melodic"])).toBe(true);
		await expect(utils.validateDistro(["noetic"])).toBe(true);
		await expect(utils.validateDistro(["foxy"])).toBe(true);
		await expect(utils.validateDistro(["humble"])).toBe(true);
		await expect(utils.validateDistro(["rolling"])).toBe(true);
	});

	it("test not valid", async () => {
		//ROS1 End-of-Life
		await expect(utils.validateDistro(["box"])).toBe(false);
		await expect(utils.validateDistro(["c"])).toBe(false);
		await expect(utils.validateDistro(["diamondback"])).toBe(false);
		await expect(utils.validateDistro(["electric"])).toBe(false);
		await expect(utils.validateDistro(["fuerte"])).toBe(false);
		await expect(utils.validateDistro(["groovy"])).toBe(false);
		await expect(utils.validateDistro(["hydro"])).toBe(false);
		await expect(utils.validateDistro(["indigo"])).toBe(false);
		await expect(utils.validateDistro(["jade"])).toBe(false);
		await expect(utils.validateDistro(["kinetic"])).toBe(false);
		await expect(utils.validateDistro(["lunar"])).toBe(false);
		//ROS2 End-of-Life
		await expect(utils.validateDistro(["ardent"])).toBe(false);
		await expect(utils.validateDistro(["bouncy"])).toBe(false);
		await expect(utils.validateDistro(["crystal"])).toBe(false);
		await expect(utils.validateDistro(["dashing"])).toBe(false);
		await expect(utils.validateDistro(["eloquent"])).toBe(false);
		await expect(utils.validateDistro(["galactic"])).toBe(false);
		// Does not exist or not all valid
		await expect(utils.validateDistro(["foxy", "doesntexist"])).toBe(false);
		await expect(utils.validateDistro(["master"])).toBe(false);
	});
});