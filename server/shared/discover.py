import os
from shared.db import Table
from models.system import System

ENVIRONMENT = os.getenv("ENVIRONMENT", "docker")
USE_LOCAL_HARDWARE = os.getenv("USE_LOCAL_HARDWARE", "true").lower() == "true"


def discover_systems():
    """
    Meant to be ran from the master roled node (system) in a cluster of nodes (systems).
    """

    if USE_LOCAL_HARDWARE:
        # Check for local system and create new system if needed
        local_system = Table.SYSTEM.count({"container_id": "local"})
        if local_system == 0:
            local_system = System(
                name="Local System",
                description="System created by service. Please update accordingly",
                url="local",
                container_id="local",
                target_humidity=-1,
                target_temperature=-1,
                duration=-1,
                distance=-1,
            )

            # Insert the new system
            Table.SYSTEM.create(local_system)

    # TODO: Support for Kubernetes
    # if ENVIRONMENT == 'kubernetes':
    #     from kubernetes import client, config
    #     config.load_incluster_config()
    #     v1 = client.CoreV1Api()
    #     pods = v1.list_pod_for_all_namespaces(label_selector="app=pi-camera").items
    #
    #     for pod in pods:
    #         pi_id = pod.spec.node_name
    #         pod_ip = pod.status.pod_ip
    #         url = f"http://{pod_ip}:5000"
    #
    #         # Find existing system
    #         system = db.system.find_one({'container_id': pod.metadata.uid})
    #
    #         if not system:
    #             # Create new system
    #             system = System(
    #                 name=f"Pi Camera {pi_id}",
    #                 url=url,
    #                 container_id=pod.metadata.uid
    #             )
    #             db.system.insert_one(system.to_dict())
    #         else:
    #             # Update existing system
    #             db.system.update_one(
    #                 {'_id': system['_id']},
    #                 {'$set': {'url': url, 'container_id': pod.metadata.uid}}
    #             )

    # TODO: Support for Docker
    # elif ENVIRONMENT == 'docker':
    #     client = docker.from_env()
    #     for container in client.containers.list():
    #         if container.name.startswith('pi-camera-'):
    #             pi_id = container.name.split('-')[-1]
    #             ip = container.attrs['NetworkSettings']['Networks']['multi-camera_default']['IPAddress']
    #             url = f"http://{ip}:5000"
    #
    #             # Find existing system
    #             system = db.system.find_one({'container_id': container.id})
    #
    #             if not system:
    #                 # Create new system
    #                 system = System(
    #                     name=f"Pi Camera {pi_id}",
    #                     url=url,
    #                     container_id=container.id
    #                 )
    #                 db.system.insert_one(system.to_dict())
    #             else:
    #                 # Update existing system
    #                 db.system.update_one(
    #                     {'_id': system['_id']},
    #                     {'$set': {'url': url}}
    #                 )
